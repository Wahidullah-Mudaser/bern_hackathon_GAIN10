# UI Components Summary - Claire & George CMS

## Identified UI Components and Elements

### 1. Typography Elements

#### Headings
| Component | Current Value | Description | CSS Property |
|-----------|---------------|-------------|--------------|
| H1 | `text-4xl md:text-6xl font-bold` | Main page headings | `font-size` |
| H2 | `text-4xl font-bold` | Section headings | `font-size` |
| H3 | `text-2xl font-bold` | Card titles | `font-size` |

#### Body Text
| Component | Current Value | Description | CSS Property |
|-----------|---------------|-------------|--------------|
| Body text | `text-lg` | Main content | `font-size` |
| Button text | `font-medium` | Interactive elements | `font-weight` |
| Navigation links | `hover:underline` | Menu items | `text-decoration` |
| Descriptive text | `text-muted-foreground` | Muted content | `color` |

### 2. Layout Components

#### Containers
| Component | Current Value | Description | CSS Property |
|-----------|---------------|-------------|--------------|
| Cards | `p-6` | Content containers | `padding` |
| Sections | `py-16` | Page sections | `padding` |
| Grid layouts | `grid md:grid-cols-3 gap-8` | Multi-column layouts | `display` |
| Navigation | `space-x-8` | Menu containers | `gap` |

### 3. Color System

#### Brand Colors
| Component | Current Value | Description | CSS Property |
|-----------|---------------|-------------|--------------|
| Primary | `hsl(336 75% 45%)` | Brand color | `color` |
| Background | `hsl(0 0% 100%)` | Page background | `background-color` |
| Foreground | `hsl(210 11% 15%)` | Text color | `color` |
| Muted | `hsl(210 11% 64%)` | Secondary text | `color` |
| Border | `hsl(210 12% 90%)` | Border color | `border-color` |

### 4. Interactive Elements

#### Buttons and Links
| Component | Current Value | Description | CSS Property |
|-----------|---------------|-------------|--------------|
| Button padding | `px-8 py-3` | Interactive spacing | `padding` |
| Button hover | `hover:bg-white/10` | Hover states | `background-color` |
| Link hover | `hover:text-primary` | Navigation hover | `color` |
| Card hover | `hover:shadow-alpine` | Container hover | `box-shadow` |

### 5. Spacing System

#### Padding & Margins
| Component | Current Value | Description | CSS Property |
|-----------|---------------|-------------|--------------|
| Container padding | `px-4` | Page containers | `padding` |
| Section margins | `mb-8` | Section spacing | `margin` |
| Element gaps | `gap-2` | Component spacing | `gap` |

## Potential Modifications by Disability Type

### 1. Wheelchair Users (`wheelchair_user`)

**Focus Areas**: Navigation, interaction, information hierarchy

#### Typography Modifications
- **H1**: Increase font size for better visibility
- **Button text**: Increase font weight for better contrast
- **Navigation links**: Add stronger underlines for clarity

#### Layout Modifications
- **Button padding**: Increase for larger click targets
- **Grid layouts**: Ensure logical tab order
- **Navigation spacing**: Increase for easier navigation

#### Color Modifications
- **Primary color**: Ensure high contrast with background
- **Button hover**: More visible hover states
- **Link hover**: Stronger color changes

### 2. Dyslexia (`dyslexia`)

**Focus Areas**: Reading, comprehension, visual clarity

#### Typography Modifications
- **All text**: Increase font size (1.25x)
- **Body text**: Increase line height (1.6-1.8)
- **Font family**: Use dyslexia-friendly fonts (OpenDyslexic)
- **Font weight**: Increase for better readability

#### Layout Modifications
- **Grid layouts**: Reduce to 2 columns maximum
- **Section spacing**: Increase for better content separation
- **Element gaps**: Increase for reduced visual clutter

#### Color Modifications
- **Background**: Use off-white or light cream
- **Text color**: High contrast dark colors
- **Muted text**: Ensure sufficient contrast

### 3. Cognitive Impairment (`cognitive_impairment`)

**Focus Areas**: Simplicity, clarity, reduced distractions

#### Typography Modifications
- **Headings**: Clearer hierarchy with larger size differences
- **Body text**: Slightly larger for easier reading
- **Button text**: Bold for clear call-to-action

#### Layout Modifications
- **Grid layouts**: Maximum 2 columns
- **Card padding**: Increase for better content separation
- **Navigation**: Simplified with fewer options
- **Section spacing**: Increase for clear content blocks

#### Color Modifications
- **Primary color**: Calming green tones
- **Background**: Soft, non-distracting colors
- **Interactive elements**: Clear, consistent colors

### 4. Anxiety/Travel Fear (`anxiety_travel_fear`)

**Focus Areas**: Calming experience, clear information, reassurance

#### Typography Modifications
- **Headings**: Softer, less aggressive styling
- **Body text**: Comfortable reading size
- **Button text**: Reassuring, clear language

#### Layout Modifications
- **Grid layouts**: Simplified, less overwhelming
- **Card hover**: Subtle, calming effects
- **Navigation**: Clear, predictable structure

#### Color Modifications
- **Primary color**: Calming blue tones
- **Background**: Soft, soothing colors
- **Interactive elements**: Gentle, non-threatening colors

### 5. Low Vision (`low_vision`)

**Focus Areas**: High contrast, large text, clear hierarchy

#### Typography Modifications
- **All text**: Significantly larger (1.5x minimum)
- **Font weight**: Bold for better visibility
- **Line height**: Increased for better readability

#### Layout Modifications
- **Button padding**: Much larger for easier interaction
- **Grid layouts**: Single column preferred
- **Section spacing**: Increased for clear separation

#### Color Modifications
- **Background**: Dark background
- **Text color**: Light, high-contrast colors
- **Primary color**: Bright, highly visible colors
- **Interactive elements**: High contrast with clear states

## Implementation Priority

### High Priority (P1)
1. **Typography size changes** for low vision and dyslexia
2. **Color contrast improvements** for all disability types
3. **Button size increases** for wheelchair users and low vision
4. **Grid layout simplification** for cognitive impairment

### Medium Priority (P2)
1. **Font family changes** for dyslexia
2. **Spacing adjustments** for all types
3. **Hover state improvements** for better interaction
4. **Navigation enhancements** for wheelchair users

### Low Priority (P3)
1. **Animation reductions** for cognitive impairment
2. **Border color adjustments** for visual consistency
3. **Shadow modifications** for depth perception
4. **Minor spacing tweaks** for aesthetic improvements

## Content Adaptation Requirements

### Wheelchair Users
- Clear accessibility information
- Detailed facility descriptions
- Contact information prominence

### Dyslexia
- Simplified language
- Short, clear sentences
- Bullet points and lists

### Cognitive Impairment
- Step-by-step instructions
- Clear, simple language
- Reduced information density

### Anxiety/Travel Fear
- Reassuring language
- Clear safety information
- Easy-to-find support contacts

### Low Vision
- High contrast text
- Clear, descriptive content
- Prominent contact information

## Testing Recommendations

### Automated Testing
- Use axe-core for accessibility testing
- Lighthouse accessibility audits
- Color contrast checkers

### Manual Testing
- Keyboard navigation testing
- Screen reader testing
- Real user testing with disabilities

### Performance Testing
- CSS modification impact
- React re-render optimization
- Bundle size monitoring
