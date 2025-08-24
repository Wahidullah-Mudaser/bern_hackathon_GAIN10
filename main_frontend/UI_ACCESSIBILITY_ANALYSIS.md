# UI Accessibility Analysis for Claire & George CMS

## Overview

This system analyzes UI components in the Claire & George CMS website and provides specific modifications for different disability types. The analysis covers the Home page, Hotels page, and Tours page, identifying UI elements that need adaptation based on accessibility requirements.

## Identified UI Components

### 1. Typography Elements

#### Headings
- **H1**: Main page headings (`text-4xl md:text-6xl font-bold`)
- **H2**: Section headings (`text-4xl font-bold`)
- **H3**: Card titles (`text-2xl font-bold`)

#### Body Text
- **Body text**: Main content (`text-lg`)
- **Button text**: Interactive elements (`font-medium`)
- **Navigation links**: Menu items (`hover:underline`)
- **Descriptive text**: Muted content (`text-muted-foreground`)

### 2. Layout Components

#### Containers
- **Cards**: Content containers (`p-6`)
- **Sections**: Page sections (`py-16`)
- **Grid layouts**: Multi-column layouts (`grid md:grid-cols-3 gap-8`)
- **Navigation**: Menu containers (`space-x-8`)

### 3. Color System

#### Brand Colors
- **Primary**: Brand color (`hsl(336 75% 45%)`)
- **Background**: Page background (`hsl(0 0% 100%)`)
- **Foreground**: Text color (`hsl(210 11% 15%)`)
- **Muted**: Secondary text (`hsl(210 11% 64%)`)
- **Border**: Border color (`hsl(210 12% 90%)`)

### 4. Interactive Elements

#### Buttons
- **Button padding**: Interactive spacing (`px-8 py-3`)
- **Button hover**: Hover states (`hover:bg-white/10`)
- **Link hover**: Navigation hover (`hover:text-primary`)
- **Card hover**: Container hover (`hover:shadow-alpine`)

### 5. Spacing System

#### Padding & Margins
- **Container padding**: Page containers (`px-4`)
- **Section margins**: Section spacing (`mb-8`)
- **Element gaps**: Component spacing (`gap-2`)

## Disability Types and Requirements

### 1. Wheelchair Users (`wheelchair_user`)
**Needs**: Clear navigation, accessible button sizes, good contrast, logical information hierarchy

**Key UI Modifications**:
- Larger click targets for buttons
- Clear visual hierarchy
- High contrast colors
- Logical tab order
- Accessible form elements

### 2. Dyslexia (`dyslexia`)
**Needs**: Dyslexia-friendly fonts, increased line spacing, high contrast, simple layouts, reduced cognitive load

**Key UI Modifications**:
- OpenDyslexic or similar fonts
- Increased line height (1.6-1.8)
- High contrast color schemes
- Simplified layouts
- Reduced visual clutter
- Larger text sizes

### 3. Cognitive Impairment (`cognitive_impairment`)
**Needs**: Simple layouts, clear navigation, reduced distractions, consistent design patterns, step-by-step processes

**Key UI Modifications**:
- Simplified grid layouts (fewer columns)
- Increased spacing between elements
- Clear visual hierarchy
- Consistent button placement
- Reduced animations
- Clear call-to-action buttons

### 4. Anxiety/Travel Fear (`anxiety_travel_fear`)
**Needs**: Calming color schemes, clear information, reduced visual clutter, reassuring content, easy navigation

**Key UI Modifications**:
- Soothing color palettes (blues, greens)
- Reduced visual complexity
- Clear information hierarchy
- Reassuring language in content
- Easy-to-find contact information
- Simplified navigation

### 5. Low Vision (`low_vision`)
**Needs**: High contrast colors, larger text sizes, clear visual hierarchy, good spacing, readable fonts

**Key UI Modifications**:
- High contrast color schemes
- Larger font sizes (minimum 18px)
- Bold text weights
- Clear visual hierarchy
- Increased spacing
- High contrast buttons and links

## Analysis Process

### 1. Component Identification
The system identifies UI components from the React codebase:
- Typography elements (headings, body text, buttons)
- Layout components (cards, sections, grids)
- Color system (primary, background, foreground)
- Interactive elements (buttons, links, hover states)
- Spacing system (padding, margins, gaps)

### 2. GPT-5 Analysis
For each disability type, the system:
- Analyzes the specific needs of the disability
- Identifies which UI elements need modification
- Provides specific CSS property changes
- Assigns priority levels (1-5)
- Generates reasoning for each modification

### 3. Output Generation
The system generates three types of output:
- **JSON Analysis Report**: Complete analysis with all modifications
- **CSS Modifications**: Ready-to-use CSS code
- **React Modifications**: Component-specific changes

## Usage

### Running the Analyzer

1. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Set Environment Variable**:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

3. **Run Analysis**:
```bash
python ui_accessibility_analyzer.py
```

### Output Files

The analyzer creates three files for each disability type:

1. **`{disability_type}_analysis.json`**: Complete analysis report
2. **`{disability_type}_modifications.css`**: CSS modifications
3. **`{disability_type}_react_modifications.json`**: React component changes

### Example Output

#### CSS Modifications
```css
/* Accessibility modifications for low_vision */
.persona-low-vision {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(0 0% 95%);
  background-color: hsl(0 0% 5%);
}
```

#### React Modifications
```json
{
  "className_modifications": {
    "body": ["text-xl", "leading-relaxed"]
  },
  "style_modifications": {
    "button": {
      "padding": "1rem 2rem",
      "font-size": "1.125rem"
    }
  },
  "content_changes": [
    "Use high contrast colors",
    "Increase text size"
  ]
}
```

## Implementation in React

### 1. CSS Integration
Add the generated CSS to your `src/index.css` file:

```css
/* Import accessibility modifications */
@import './accessibility_reports/low_vision_modifications.css';
@import './accessibility_reports/dyslexia_modifications.css';
/* ... other disability types */
```

### 2. React Component Integration
Use the generated React modifications in your components:

```tsx
import { usePersona } from '@/contexts/PersonaContext';

const MyComponent = () => {
  const { disabilityType } = usePersona();
  
  const getAccessibilityStyles = () => {
    switch (disabilityType) {
      case 'low_vision':
        return { fontSize: '1.25rem', fontWeight: 600 };
      case 'dyslexia':
        return { fontFamily: 'OpenDyslexic', lineHeight: 1.8 };
      default:
        return {};
    }
  };
  
  return (
    <div style={getAccessibilityStyles()}>
      {/* Component content */}
    </div>
  );
};
```

### 3. PersonaContext Integration
The existing PersonaContext already supports disability types. The CSS classes are automatically applied based on the selected disability type.

## Best Practices

### 1. Testing
- Test each disability type with real users when possible
- Use accessibility testing tools (axe, Lighthouse)
- Test with screen readers and keyboard navigation

### 2. Performance
- CSS modifications are lightweight and don't impact performance
- React modifications should be conditional to avoid unnecessary re-renders

### 3. Maintenance
- Re-run the analyzer when UI components change
- Update the `_define_ui_components()` method when new components are added
- Review and validate GPT-5 recommendations

### 4. Content Adaptation
- Some modifications require content changes (not just UI)
- Work with content creators to adapt language and structure
- Ensure all content is accessible across disability types

## Future Enhancements

1. **Real-time Analysis**: Integrate with development workflow
2. **User Testing Integration**: Collect feedback from users with disabilities
3. **Automated Testing**: Generate accessibility test cases
4. **Performance Monitoring**: Track accessibility metrics
5. **Multi-language Support**: Extend to other languages and cultures

## Conclusion

This system provides a comprehensive approach to making the Claire & George CMS accessible to users with different disabilities. By combining automated analysis with human review, we can ensure that the website meets accessibility standards while maintaining the brand's visual identity and user experience.
