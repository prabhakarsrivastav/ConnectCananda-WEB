# Step-by-Step Signup Flow - Visual Guide

## How It Works

The new signup form uses a **single field wizard** approach where users fill out ONE field at a time, making the registration process simple and focused.

---

## Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  Get Started Today                              │
│  Enter your email to create an account          │
├─────────────────────────────────────────────────┤
│  Progress: [██████][░░░░░░][░░░░░░][░░░░░░][░░░░░░]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Email Address                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ your.email@example.com                    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│           [Continue] ──────────────────────────>│
└─────────────────────────────────────────────────┘

                        ↓

┌─────────────────────────────────────────────────┐
│  Get Started Today                              │
│  What's your first name?                        │
├─────────────────────────────────────────────────┤
│  Progress: [██████][██████][░░░░░░][░░░░░░][░░░░░░]│
├─────────────────────────────────────────────────┤
│                                                 │
│  First Name                                     │
│  ┌───────────────────────────────────────────┐ │
│  │ John                                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Email: john@example.com                        │
│                                                 │
│     [Back]      [Continue] ─────────────────────>│
└─────────────────────────────────────────────────┘

                        ↓

┌─────────────────────────────────────────────────┐
│  Get Started Today                              │
│  What's your last name?                         │
├─────────────────────────────────────────────────┤
│  Progress: [██████][██████][██████][░░░░░░][░░░░░░]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Last Name                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ Doe                                       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Email: john@example.com                        │
│  Name: John ...                                 │
│                                                 │
│     [Back]      [Continue] ─────────────────────>│
└─────────────────────────────────────────────────┘

                        ↓

┌─────────────────────────────────────────────────┐
│  Get Started Today                              │
│  Create a secure password                       │
├─────────────────────────────────────────────────┤
│  Progress: [██████][██████][██████][██████][░░░░░░]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Password                                       │
│  ┌───────────────────────────────────────────┐ │
│  │ ••••••••••••                          👁 │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Email: john@example.com                        │
│  Name: John Doe                                 │
│                                                 │
│     [Back]      [Continue] ─────────────────────>│
└─────────────────────────────────────────────────┘

                        ↓

┌─────────────────────────────────────────────────┐
│  Get Started Today                              │
│  Confirm your password                          │
├─────────────────────────────────────────────────┤
│  Progress: [██████][██████][██████][██████][██████]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Confirm Password                               │
│  ┌───────────────────────────────────────────┐ │
│  │ ••••••••••••                          👁 │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Email: john@example.com                        │
│  Name: John Doe                                 │
│                                                 │
│     [Back]      [Sign Up] ──────────> ✅ SUCCESS│
└─────────────────────────────────────────────────┘
```

---

## Key Features

### 1. **Single Field Focus**
- Only one input field visible at a time
- Reduces cognitive load
- Faster completion
- Better mobile experience

### 2. **Progress Indicator**
```
Step 1: [████] □ □ □ □  (20% complete)
Step 2: [████][████] □ □ □  (40% complete)
Step 3: [████][████][████] □ □  (60% complete)
Step 4: [████][████][████][████] □  (80% complete)
Step 5: [████][████][████][████][████]  (100% complete)
```

### 3. **Back Navigation**
Users can go back to any previous step to edit their information:
- Step 2-5: Shows "Back" button
- Clicking "Back" pre-fills the field with previously entered data
- Easy to correct mistakes

### 4. **Previous Data Display**
After entering email and name, users can see what they've entered:
```
Email: john@example.com
Name: John Doe
```
This provides context and confidence during the process.

### 5. **Validation at Each Step**
- **Email**: Must be valid email format
- **First Name**: Minimum 2 characters
- **Last Name**: Minimum 2 characters  
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match password

### 6. **Clear CTAs (Call-to-Actions)**
- Steps 1-4: "Continue" button
- Step 5: "Sign Up" button (final action)
- All steps (except step 1): "Back" button

---

## User Journey Example

**Scenario**: New user "John Doe" wants to register

1. **Lands on homepage** → Sees the signup form
2. **Enters email** → Types "john@example.com" → Clicks "Continue"
3. **Enters first name** → Types "John" → Clicks "Continue"
4. **Enters last name** → Types "Doe" → Clicks "Continue"
5. **Creates password** → Types secure password → Clicks "Continue"
6. **Confirms password** → Re-types password → Clicks "Sign Up"
7. **Success!** → Gets welcome message → Automatically logged in

**Total clicks**: 5 (one per step)
**Total fields**: 1 visible at a time
**Time**: ~30 seconds (vs 2-3 minutes with traditional forms)

---

## Benefits Over Traditional Forms

| Traditional Multi-Field Form | Step-by-Step Single Field |
|------------------------------|---------------------------|
| All fields visible at once   | One field at a time       |
| Overwhelming for users       | Simple and focused        |
| Higher abandonment rate      | Better completion rate    |
| Difficult on mobile          | Mobile-friendly           |
| Hard to correct mistakes     | Easy back navigation      |
| No progress indication       | Clear progress bar        |

---

## Technical Implementation

### State Management
```typescript
const [step, setStep] = useState('email');  // Current step
const [currentInput, setCurrentInput] = useState("");  // Current field value
const [email, setEmail] = useState("");  // Stored email
const [firstName, setFirstName] = useState("");  // Stored first name
const [lastName, setLastName] = useState("");  // Stored last name
const [password, setPassword] = useState("");  // Stored password
```

### Step Transition Logic
```typescript
if (step === 'email') {
  // Validate email
  setEmail(currentInput);
  setStep('firstName');
}
// ... similar for other steps
```

### Form Submission
Only on the final step (confirmPassword) does the actual signup API call happen:
```typescript
await signup({ email, password, firstName, lastName });
```

---

## Accessibility Features

- ✅ **Auto-focus**: Input field automatically focused on each step
- ✅ **Clear labels**: Each field has descriptive label
- ✅ **Error messages**: Toast notifications for validation errors
- ✅ **Keyboard navigation**: Tab, Enter work as expected
- ✅ **Password visibility**: Toggle for users with visual needs
- ✅ **Progress indicator**: Visual and semantic progress tracking

---

## Mobile Optimization

The single-field approach is **perfect for mobile**:
- No scrolling needed
- Large touch targets
- Better keyboard experience
- Clearer focus
- Less screen real estate needed
