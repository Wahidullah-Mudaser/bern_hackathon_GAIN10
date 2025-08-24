# UI Accessibility Analysis System

## Quick Start

This system analyzes UI components in the Claire & George CMS and provides specific modifications for different disability types.

### Prerequisites

1. **Python 3.8+**
2. **OpenAI API Key**

### Installation

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Set your OpenAI API key**:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

### Usage

#### Run Full Analysis
```bash
python ui_accessibility_analyzer.py
```

#### Run Example Usage
```bash
python example_usage.py
```

## What It Does

### 1. Identifies UI Components
The system analyzes your React codebase and identifies:
- **Typography**: Headings, body text, buttons, links
- **Layout**: Cards, sections, grids, navigation
- **Colors**: Primary, background, foreground, muted
- **Interactive Elements**: Buttons, hover states, focus indicators
- **Spacing**: Padding, margins, gaps

### 2. Analyzes Disability Needs
For each disability type, it determines specific requirements:

| Disability Type | Key Needs |
|----------------|-----------|
| **Wheelchair Users** | Clear navigation, accessible button sizes, good contrast |
| **Dyslexia** | Dyslexia-friendly fonts, increased line spacing, high contrast |
| **Cognitive Impairment** | Simple layouts, clear navigation, reduced distractions |
| **Anxiety/Travel Fear** | Calming colors, clear information, reduced clutter |
| **Low Vision** | High contrast, larger text, clear hierarchy |

### 3. Generates Modifications
For each disability type, it creates:
- **CSS modifications** ready to use
- **React component changes**
- **Content adaptation recommendations**

## Output Files

The system generates three files for each disability type:

```
accessibility_reports/
├── wheelchair_user_analysis.json
├── wheelchair_user_modifications.css
├── wheelchair_user_react_modifications.json
├── dyslexia_analysis.json
├── dyslexia_modifications.css
├── dyslexia_react_modifications.json
└── ... (for each disability type)
```

### Example CSS Output
```css
/* Accessibility modifications for low_vision */
.persona-low-vision {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(0 0% 95%);
  background-color: hsl(0 0% 5%);
}
```

### Example React Output
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
  }
}
```

## Integration with Your React App

### 1. Add CSS to your stylesheet
```css
/* In src/index.css */
@import './accessibility_reports/low_vision_modifications.css';
@import './accessibility_reports/dyslexia_modifications.css';
```

### 2. Use in React components
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
      {/* Your content */}
    </div>
  );
};
```

## Disability Types Supported

### 1. Wheelchair Users (`wheelchair_user`)
- **Focus**: Navigation and interaction
- **Key Changes**: Larger buttons, clear hierarchy, good contrast

### 2. Dyslexia (`dyslexia`)
- **Focus**: Reading and comprehension
- **Key Changes**: Special fonts, increased spacing, high contrast

### 3. Cognitive Impairment (`cognitive_impairment`)
- **Focus**: Simplicity and clarity
- **Key Changes**: Simplified layouts, clear navigation, reduced distractions

### 4. Anxiety/Travel Fear (`anxiety_travel_fear`)
- **Focus**: Calming and reassuring experience
- **Key Changes**: Soothing colors, clear information, reduced complexity

### 5. Low Vision (`low_vision`)
- **Focus**: Visual accessibility
- **Key Changes**: High contrast, larger text, clear hierarchy

## Customization

### Adding New UI Components
Edit the `_define_ui_components()` method in `ui_accessibility_analyzer.py`:

```python
def _define_ui_components(self) -> Dict[str, List[UIElement]]:
    return {
        "typography": [
            # Add your typography elements here
            UIElement("new-heading", "heading", "text-3xl", "New heading style", "font-size", "medium"),
        ],
        # Add other categories...
    }
```

### Adding New Disability Types
1. Add to the `DisabilityType` enum
2. Add disability information to `_create_analysis_prompt()`
3. Add fallback profile to `_create_fallback_profile()`

## Best Practices

### 1. Testing
- Test with real users when possible
- Use accessibility testing tools (axe, Lighthouse)
- Test with screen readers

### 2. Performance
- CSS modifications are lightweight
- React modifications should be conditional

### 3. Maintenance
- Re-run analysis when UI changes
- Review GPT recommendations
- Update component definitions

## Troubleshooting

### Common Issues

1. **API Key Error**
   ```
   Error: OPENAI_API_KEY environment variable not set
   ```
   **Solution**: Set your API key with `export OPENAI_API_KEY="your-key"`

2. **Import Error**
   ```
   ModuleNotFoundError: No module named 'openai'
   ```
   **Solution**: Install dependencies with `pip install -r requirements.txt`

3. **JSON Parse Error**
   ```
   Error parsing GPT response
   ```
   **Solution**: Check your API key and internet connection

### Getting Help

1. Check the generated reports in `accessibility_reports/`
2. Review the `UI_ACCESSIBILITY_ANALYSIS.md` for detailed documentation
3. Run `python example_usage.py` for interactive examples

## Contributing

To improve the system:

1. **Add new UI components** to the component definitions
2. **Enhance disability profiles** with more specific requirements
3. **Improve GPT prompts** for better analysis
4. **Add new output formats** for different frameworks

## License

This system is part of the Claire & George CMS project and follows the same licensing terms.
