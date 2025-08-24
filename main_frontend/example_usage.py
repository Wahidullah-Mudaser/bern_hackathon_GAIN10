#!/usr/bin/env python3
"""
Example usage of the UI Accessibility Analyzer
This script demonstrates how to use the analyzer for a specific disability type.
"""

import os
from ui_accessibility_analyzer import UIAccessibilityAnalyzer, DisabilityType

def analyze_single_disability():
    """Analyze UI modifications for a single disability type"""
    
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        print("Please set it with: export OPENAI_API_KEY='your-api-key-here'")
        return
    
    # Initialize analyzer
    analyzer = UIAccessibilityAnalyzer(api_key)
    
    # Choose a disability type to analyze
    disability_type = DisabilityType.DYSLEXIA
    
    print(f"Analyzing UI modifications for: {disability_type.value}")
    print("=" * 50)
    
    # Perform analysis
    profile = analyzer.analyze_disability_type(disability_type)
    
    # Print results
    print(f"\nSummary: {profile.summary}")
    print(f"\nNumber of modifications: {len(profile.modifications)}")
    
    # Print all modifications
    print(f"\nAll Modifications:")
    for i, mod in enumerate(profile.modifications, 1):
        print(f"\n{i}. {mod.element.component_name}.{mod.element.css_property}")
        print(f"   Current: {mod.element.current_value}")
        print(f"   New: {mod.new_value}")
        print(f"   Priority: {mod.priority}")
        print(f"   Reason: {mod.reasoning}")
    
    # Generate and print CSS
    print(f"\nGenerated CSS:")
    print("-" * 30)
    css = analyzer.generate_css_modifications(profile)
    print(css)
    
    # Generate and print React modifications
    print(f"\nReact Modifications:")
    print("-" * 30)
    react_mods = analyzer.generate_react_modifications(profile)
    import json
    print(json.dumps(react_mods, indent=2))
    
    # Save reports
    analyzer.save_analysis_report(profile)
    
    print(f"\nAnalysis complete! Check the 'accessibility_reports' directory for saved files.")

def analyze_multiple_disabilities():
    """Analyze UI modifications for multiple disability types"""
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        return
    
    analyzer = UIAccessibilityAnalyzer(api_key)
    
    # Analyze specific disability types
    disability_types = [
        DisabilityType.LOW_VISION,
        DisabilityType.DYSLEXIA,
        DisabilityType.COGNITIVE_IMPAIRMENT
    ]
    
    for disability_type in disability_types:
        print(f"\n{'='*60}")
        print(f"Analyzing: {disability_type.value}")
        print(f"{'='*60}")
        
        profile = analyzer.analyze_disability_type(disability_type)
        
        print(f"Summary: {profile.summary}")
        print(f"Modifications: {len(profile.modifications)}")
        
        # Show high priority modifications only
        high_priority = [mod for mod in profile.modifications if mod.priority <= 2]
        if high_priority:
            print(f"\nHigh Priority Changes:")
            for mod in high_priority:
                print(f"- {mod.element.component_name}: {mod.current_value} → {mod.new_value}")
        
        # Save reports
        analyzer.save_analysis_report(profile)

def compare_disability_types():
    """Compare modifications across different disability types"""
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        return
    
    analyzer = UIAccessibilityAnalyzer(api_key)
    
    # Analyze all disability types
    profiles = {}
    for disability_type in DisabilityType:
        print(f"Analyzing {disability_type.value}...")
        profiles[disability_type] = analyzer.analyze_disability_type(disability_type)
    
    # Compare results
    print(f"\n{'='*80}")
    print("COMPARISON OF DISABILITY TYPES")
    print(f"{'='*80}")
    
    for disability_type, profile in profiles.items():
        print(f"\n{disability_type.value.upper()}:")
        print(f"  Summary: {profile.summary}")
        print(f"  Total modifications: {len(profile.modifications)}")
        
        # Count modifications by type
        typography_count = len([mod for mod in profile.modifications if mod.element.css_property in ['font-size', 'font-weight', 'line-height']])
        color_count = len([mod for mod in profile.modifications if mod.element.css_property in ['color', 'background-color']])
        layout_count = len([mod for mod in profile.modifications if mod.element.css_property in ['padding', 'margin', 'gap', 'display']])
        
        print(f"  Typography changes: {typography_count}")
        print(f"  Color changes: {color_count}")
        print(f"  Layout changes: {layout_count}")
    
    # Save all reports
    for disability_type, profile in profiles.items():
        analyzer.save_analysis_report(profile)

if __name__ == "__main__":
    print("UI Accessibility Analyzer - Example Usage")
    print("=" * 50)
    
    while True:
        print("\nChoose an option:")
        print("1. Analyze single disability type (Dyslexia)")
        print("2. Analyze multiple disability types")
        print("3. Compare all disability types")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            analyze_single_disability()
        elif choice == "2":
            analyze_multiple_disabilities()
        elif choice == "3":
            compare_disability_types()
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")
