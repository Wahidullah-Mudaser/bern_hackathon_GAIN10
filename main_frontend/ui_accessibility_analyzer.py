#!/usr/bin/env python3
"""
UI Accessibility Analyzer for Claire & George CMS
Uses GPT-5 to analyze UI components and determine modifications for different disability types.
"""

import json
import openai
from enum import Enum
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import os
from pathlib import Path

# Enums for disability types
class DisabilityType(str, Enum):
    WHEELCHAIR_USER = "wheelchair_user"
    DYSLEXIA = "dyslexia"
    COGNITIVE_IMPAIRMENT = "cognitive_impairment"
    ANXIETY_TRAVEL_FEAR = "anxiety_travel_fear"
    LOW_VISION = "low_vision"

@dataclass
class UIElement:
    """Represents a UI element that can be modified"""
    component_name: str
    element_type: str
    current_value: str
    description: str
    css_property: str
    importance: str  # "high", "medium", "low"

@dataclass
class UIModification:
    """Represents a modification to a UI element"""
    element: UIElement
    new_value: str
    reasoning: str
    priority: int  # 1-5, where 1 is highest priority

@dataclass
class AccessibilityProfile:
    """Complete accessibility profile for a disability type"""
    disability_type: DisabilityType
    modifications: List[UIModification]
    css_classes: List[str]
    content_adaptations: List[str]
    summary: str

class UIAccessibilityAnalyzer:
    def __init__(self, api_key: str):
        """Initialize the analyzer with OpenAI API key"""
        self.client = openai.OpenAI(api_key=api_key)
        
        # Define the UI components and elements identified from the codebase
        self.ui_components = self._define_ui_components()
    
    def _define_ui_components(self) -> Dict[str, List[UIElement]]:
        """Define the UI components and elements found in the codebase"""
        return {
            "typography": [
                UIElement("h1", "heading", "text-4xl md:text-6xl font-bold", "Main page headings", "font-size", "high"),
                UIElement("h2", "heading", "text-4xl font-bold", "Section headings", "font-size", "high"),
                UIElement("h3", "heading", "text-2xl font-bold", "Card titles", "font-size", "medium"),
                UIElement("body", "text", "text-lg", "Body text", "font-size", "high"),
                UIElement("button", "text", "font-medium", "Button text", "font-weight", "medium"),
                UIElement("link", "text", "hover:underline", "Navigation links", "text-decoration", "medium"),
                UIElement("description", "text", "text-muted-foreground", "Descriptive text", "color", "medium"),
            ],
            "layout": [
                UIElement("card", "container", "p-6", "Card padding", "padding", "medium"),
                UIElement("section", "container", "py-16", "Section spacing", "padding", "medium"),
                UIElement("grid", "layout", "grid md:grid-cols-3 gap-8", "Grid layout", "display", "high"),
                UIElement("navigation", "container", "space-x-8", "Navigation spacing", "gap", "medium"),
            ],
            "colors": [
                UIElement("primary", "color", "hsl(336 75% 45%)", "Primary brand color", "color", "high"),
                UIElement("background", "color", "hsl(0 0% 100%)", "Background color", "background-color", "high"),
                UIElement("foreground", "color", "hsl(210 11% 15%)", "Text color", "color", "high"),
                UIElement("muted", "color", "hsl(210 11% 64%)", "Muted text color", "color", "medium"),
                UIElement("border", "color", "hsl(210 12% 90%)", "Border color", "border-color", "low"),
            ],
            "interactive": [
                UIElement("button", "interactive", "px-8 py-3", "Button padding", "padding", "high"),
                UIElement("button", "interactive", "hover:bg-white/10", "Button hover state", "background-color", "medium"),
                UIElement("link", "interactive", "hover:text-primary", "Link hover state", "color", "medium"),
                UIElement("card", "interactive", "hover:shadow-alpine", "Card hover effect", "box-shadow", "low"),
            ],
            "spacing": [
                UIElement("container", "spacing", "px-4", "Container padding", "padding", "medium"),
                UIElement("section", "spacing", "mb-8", "Section margin bottom", "margin", "medium"),
                UIElement("element", "spacing", "gap-2", "Element gap", "gap", "low"),
            ]
        }
    
    def analyze_disability_type(self, disability_type: DisabilityType) -> AccessibilityProfile:
        """Analyze UI modifications needed for a specific disability type"""
        
        # Create the prompt for GPT-5
        prompt = self._create_analysis_prompt(disability_type)
        
        try:
            # Call GPT-5 for analysis
            response = self.client.chat.completions.create(
                model="gpt-4o",  # Using GPT-4o as GPT-5 is not yet available
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert in web accessibility and UI design. You analyze UI components and provide specific recommendations for different disability types."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            # Parse the response
            analysis_result = self._parse_gpt_response(response.choices[0].message.content, disability_type)
            return analysis_result
            
        except Exception as e:
            print(f"Error analyzing disability type {disability_type}: {e}")
            return self._create_fallback_profile(disability_type)
    
    def _create_analysis_prompt(self, disability_type: DisabilityType) -> str:
        """Create a detailed prompt for GPT-5 analysis"""
        
        disability_info = {
            DisabilityType.WHEELCHAIR_USER: {
                "description": "Users with mobility impairments who use wheelchairs",
                "needs": "Clear navigation, accessible button sizes, good contrast, logical information hierarchy"
            },
            DisabilityType.DYSLEXIA: {
                "description": "Users with reading difficulties",
                "needs": "Dyslexia-friendly fonts, increased line spacing, high contrast, simple layouts, reduced cognitive load"
            },
            DisabilityType.COGNITIVE_IMPAIRMENT: {
                "description": "Users with cognitive disabilities or learning difficulties",
                "needs": "Simple layouts, clear navigation, reduced distractions, consistent design patterns, step-by-step processes"
            },
            DisabilityType.ANXIETY_TRAVEL_FEAR: {
                "description": "Users with anxiety or travel-related fears",
                "needs": "Calming color schemes, clear information, reduced visual clutter, reassuring content, easy navigation"
            },
            DisabilityType.LOW_VISION: {
                "description": "Users with visual impairments but not completely blind",
                "needs": "High contrast colors, larger text sizes, clear visual hierarchy, good spacing, readable fonts"
            }
        }
        
        info = disability_info[disability_type]
        
        prompt = f"""
        Analyze the UI components for accessibility modifications needed for users with {disability_type.value.replace('_', ' ')}.

        Disability Information:
        - Description: {info['description']}
        - Key Needs: {info['needs']}

        Available UI Components and Elements:
        {json.dumps(self._format_components_for_prompt(), indent=2)}

        Please provide a comprehensive analysis including:

        1. **Typography Modifications**: Font sizes, weights, line heights, font families
        2. **Color Modifications**: Background, foreground, primary colors, contrast ratios
        3. **Layout Modifications**: Spacing, padding, margins, grid layouts
        4. **Interactive Element Modifications**: Button sizes, hover states, focus indicators
        5. **Content Structure Modifications**: Information hierarchy, content density

        For each modification, provide:
        - Specific CSS property and value
        - Reasoning for the change
        - Priority level (1-5, where 1 is highest)
        - Whether it requires content adaptation or just UI changes

        Return your response as a JSON object with the following structure:
        {{
            "modifications": [
                {{
                    "element": {{
                        "component_name": "string",
                        "element_type": "string",
                        "current_value": "string",
                        "description": "string",
                        "css_property": "string",
                        "importance": "string"
                    }},
                    "new_value": "string",
                    "reasoning": "string",
                    "priority": 1-5
                }}
            ],
            "css_classes": ["list of CSS classes to add"],
            "content_adaptations": ["list of content changes needed"],
            "summary": "brief summary of key changes"
        }}
        """
        
        return prompt
    
    def _format_components_for_prompt(self) -> Dict[str, List[Dict]]:
        """Format UI components for the GPT prompt"""
        formatted = {}
        for category, elements in self.ui_components.items():
            formatted[category] = [asdict(element) for element in elements]
        return formatted
    
    def _parse_gpt_response(self, response_text: str, disability_type: DisabilityType) -> AccessibilityProfile:
        """Parse the GPT response into an AccessibilityProfile"""
        try:
            # Extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            json_str = response_text[json_start:json_end]
            
            data = json.loads(json_str)
            
            # Convert modifications back to UIModification objects
            modifications = []
            for mod_data in data.get('modifications', []):
                element_data = mod_data['element']
                element = UIElement(
                    component_name=element_data['component_name'],
                    element_type=element_data['element_type'],
                    current_value=element_data['current_value'],
                    description=element_data['description'],
                    css_property=element_data['css_property'],
                    importance=element_data['importance']
                )
                
                modification = UIModification(
                    element=element,
                    new_value=mod_data['new_value'],
                    reasoning=mod_data['reasoning'],
                    priority=mod_data['priority']
                )
                modifications.append(modification)
            
            return AccessibilityProfile(
                disability_type=disability_type,
                modifications=modifications,
                css_classes=data.get('css_classes', []),
                content_adaptations=data.get('content_adaptations', []),
                summary=data.get('summary', '')
            )
            
        except Exception as e:
            print(f"Error parsing GPT response: {e}")
            return self._create_fallback_profile(disability_type)
    
    def _create_fallback_profile(self, disability_type: DisabilityType) -> AccessibilityProfile:
        """Create a fallback profile when GPT analysis fails"""
        # Basic fallback modifications based on common accessibility guidelines
        fallback_modifications = {
            DisabilityType.LOW_VISION: [
                UIModification(
                    element=UIElement("body", "text", "text-lg", "Body text", "font-size", "high"),
                    new_value="text-xl",
                    reasoning="Larger text for better readability",
                    priority=1
                ),
                UIModification(
                    element=UIElement("primary", "color", "hsl(336 75% 45%)", "Primary brand color", "color", "high"),
                    new_value="hsl(50 100% 60%)",
                    reasoning="High contrast yellow for better visibility",
                    priority=1
                )
            ],
            DisabilityType.DYSLEXIA: [
                UIModification(
                    element=UIElement("body", "text", "text-lg", "Body text", "font-size", "high"),
                    new_value="text-xl leading-relaxed",
                    reasoning="Larger text with increased line spacing for dyslexia",
                    priority=1
                )
            ],
            DisabilityType.COGNITIVE_IMPAIRMENT: [
                UIModification(
                    element=UIElement("grid", "layout", "grid md:grid-cols-3 gap-8", "Grid layout", "display", "high"),
                    new_value="grid md:grid-cols-2 gap-12",
                    reasoning="Simplified layout with fewer columns and more spacing",
                    priority=1
                )
            ]
        }
        
        modifications = fallback_modifications.get(disability_type, [])
        
        return AccessibilityProfile(
            disability_type=disability_type,
            modifications=modifications,
            css_classes=[f"persona-{disability_type.value}"],
            content_adaptations=["Use fallback profile - manual review recommended"],
            summary=f"Fallback profile for {disability_type.value} - GPT analysis failed"
        )
    
    def generate_css_modifications(self, profile: AccessibilityProfile) -> str:
        """Generate CSS code for the accessibility modifications"""
        css_lines = []
        
        # Add persona class
        persona_class = f".persona-{profile.disability_type.value.replace('_', '-')}"
        css_lines.append(f"{persona_class} {{")
        
        # Group modifications by CSS property
        property_groups = {}
        for mod in profile.modifications:
            prop = mod.element.css_property
            if prop not in property_groups:
                property_groups[prop] = []
            property_groups[prop].append(mod)
        
        # Generate CSS for each property group
        for prop, mods in property_groups.items():
            if prop == "font-size":
                for mod in mods:
                    css_lines.append(f"  font-size: {mod.new_value};")
            elif prop == "color":
                for mod in mods:
                    css_lines.append(f"  color: {mod.new_value};")
            elif prop == "background-color":
                for mod in mods:
                    css_lines.append(f"  background-color: {mod.new_value};")
            elif prop == "padding":
                for mod in mods:
                    css_lines.append(f"  padding: {mod.new_value};")
            elif prop == "margin":
                for mod in mods:
                    css_lines.append(f"  margin: {mod.new_value};")
            elif prop == "gap":
                for mod in mods:
                    css_lines.append(f"  gap: {mod.new_value};")
            elif prop == "display":
                for mod in mods:
                    css_lines.append(f"  display: {mod.new_value};")
            elif prop == "font-weight":
                for mod in mods:
                    css_lines.append(f"  font-weight: {mod.new_value};")
            elif prop == "line-height":
                for mod in mods:
                    css_lines.append(f"  line-height: {mod.new_value};")
            elif prop == "text-decoration":
                for mod in mods:
                    css_lines.append(f"  text-decoration: {mod.new_value};")
            elif prop == "box-shadow":
                for mod in mods:
                    css_lines.append(f"  box-shadow: {mod.new_value};")
            elif prop == "border-color":
                for mod in mods:
                    css_lines.append(f"  border-color: {mod.new_value};")
        
        css_lines.append("}")
        
        return "\n".join(css_lines)
    
    def generate_react_modifications(self, profile: AccessibilityProfile) -> Dict[str, Any]:
        """Generate React component modifications"""
        modifications = {
            "className_modifications": {},
            "style_modifications": {},
            "component_props": {},
            "content_changes": profile.content_adaptations
        }
        
        for mod in profile.modifications:
            component = mod.element.component_name
            prop = mod.element.css_property
            
            if prop in ["font-size", "color", "background-color", "padding", "margin"]:
                if component not in modifications["style_modifications"]:
                    modifications["style_modifications"][component] = {}
                modifications["style_modifications"][component][prop] = mod.new_value
            
            elif prop in ["display", "gap"]:
                if component not in modifications["className_modifications"]:
                    modifications["className_modifications"][component] = []
                modifications["className_modifications"][component].append(mod.new_value)
        
        return modifications
    

def main():
    """Main function to run the analyzer"""
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        return
    
    # Initialize analyzer
    analyzer = UIAccessibilityAnalyzer(api_key)
    
    # Analyze each disability type
    for disability_type in DisabilityType:
        print(f"\n{'='*60}")
        print(f"Analyzing UI modifications for: {disability_type.value}")
        print(f"{'='*60}")
        
        # Perform analysis
        profile = analyzer.analyze_disability_type(disability_type)
        
        # Print summary
        print(f"\nSummary: {profile.summary}")
        print(f"\nNumber of modifications: {len(profile.modifications)}")
        print(f"CSS classes to add: {profile.css_classes}")
        print(f"Content adaptations: {len(profile.content_adaptations)}")
        
        # Print high priority modifications
        high_priority = [mod for mod in profile.modifications if mod.priority <= 2]
        if high_priority:
            print(f"\nHigh Priority Modifications:")
            for mod in high_priority:
                print(f"- {mod.element.component_name}.{mod.element.css_property}: {mod.current_value} → {mod.new_value}")
                print(f"  Reason: {mod.reasoning}")
        
        print(f"\nAnalysis complete for {disability_type.value}")

if __name__ == "__main__":
    main()
