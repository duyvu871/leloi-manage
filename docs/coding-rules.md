# Coding Rules for Le-Loi Admission Management System

## 1. General Coding Standards

### 1.1 Formatting
- Use 2 spaces for indentation as specified in `.prettierrc`
- Maximum line length should be 100 characters
- Use single quotes for strings
- Add trailing commas in objects and arrays
- Use semicolons at the end of statements
- Use JSX bracket same line style
- Maintain consistent spacing around operators and keywords

### 1.2 File Organization
- File names should use kebab-case for components: `language-switcher.tsx`
- Use PascalCase for React component names: `LanguageSwitcher`
- Use camelCase for variables, functions, and instances
- Group related files in appropriately named directories
- Follow the Next.js App Router convention for page organization

### 1.3 Code Comments
- Use JSDoc style comments for functions and components
- Include purpose, parameters, and return values in documentation
- Use line comments (`//`) for implementation details
- Document complex logic with clear explanations
- Mark todos with `TODO:` prefix

## 2. TypeScript Guidelines

### 2.1 Type Definitions
- Define explicit types for all variables, parameters, and return values
- Use interfaces or type aliases for complex data structures
- Place shared types in the `src/types` directory
- Export types from dedicated type files (e.g., `student.ts`, `parent.ts`)
- Use type inference when it improves code readability

### 2.2 Type Safety
- Enable strict null checks as indicated in `tsconfig.json`
- Avoid using `any` type - use proper typing or `unknown` if needed
- Use type guards when narrowing types
- Leverage TypeScript's inference where appropriate
- Use generics for reusable components and functions

### 2.3 Schema Validation
- Use Zod for schema validation and type inference
- Define schemas in the `src/schemas` directory
- Name schema files consistently: `schema.ts` for base schema, `dto.ts` for data transfer objects
- Export type definitions inferred from Zod schemas
- Follow the pattern: `export const schemaName = z.object({...}); export type SchemaType = z.infer<typeof schemaName>;`

## 3. React Component Guidelines

### 3.1 Component Structure
- Use functional components with hooks
- Use named exports for components
- Follow this ordering in components:
  1. Import statements
  2. Type definitions
  3. Component function
  4. Hook declarations
  5. Helper functions
  6. Return statement with JSX
- Add 'use client' directive for client components

### 3.2 Props
- Define prop types using TypeScript interfaces
- Use destructuring for component props
- Provide default values for optional props
- Use spread syntax sparingly to avoid passing unnecessary props
- Mark required props with appropriate validation

### 3.3 State Management
- Use Jotai for global state management
- Organize atoms by feature in dedicated store files (`src/stores`)
- Create derived atoms for computed values
- Keep component state local when possible with `useState`
- Use React Query for server state management

## 4. File Structure

### 4.1 Import Statements
- Group imports in the following order:
  1. React and Next.js imports
  2. External library imports
  3. Internal absolute imports (using path aliases)
  4. Relative imports
- Use the defined path aliases in `tsconfig.json` (e.g., `@component/`, `@hook/`, `@schema/`)
- Sort imports alphabetically within each group

### 4.2 Path Aliases
- Use the following path aliases consistently:
  - `@app/*` for app directory components
  - `@component/*` for shared components
  - `@constant/*` for constants
  - `@hook/*` for custom hooks
  - `@schema/*` for Zod schemas
  - `@service/*` for API services
  - `@store/*` for Jotai stores
  - `@type/*` for TypeScript types
  - `@util/*` for utilities

## 5. Form Handling

### 5.1 Form Structure
- Use React Hook Form for form state management
- Define Zod schemas for form validation
- Connect forms to Zod using `zodResolver`
- Follow the shadcn/ui form pattern with FormField, FormItem, FormLabel, etc.
- Handle form submission with proper error handling

### 5.2 Form Validation
- Define clear error messages in Zod schema
- Show validation errors inline with form fields
- Validate on blur or submit, not on change
- Use localized error messages when applicable
- Provide informative validation messages

## 6. API and Data Handling

### 6.1 API Services
- Create dedicated service files for API operations
- Group related API calls in service classes or objects
- Use React Query for data fetching, caching, and synchronization
- Handle loading and error states appropriately
- Follow REST conventions for API endpoint naming

### 6.2 Error Handling
- Use try/catch blocks for error handling
- Display user-friendly error messages
- Log errors for debugging purposes
- Implement error boundaries for component errors
- Use fallback UI for error states

## 7. Internationalization (i18n)

### 7.1 Translation Structure
- Store translations in JSON files under `src/constants/locales`
- Use dot notation for nested keys (e.g., `common.welcome`)
- Use the `useTranslation` hook for accessing translations
- Support placeholder variables in translations
- Follow the language folder structure in the App Router (`[lang]`)

### 7.2 Language Switching
- Use the `LanguageSwitcher` component for changing languages
- Store language preference in cookies
- Support URL-based language routing
- Fallback to default language when translation is missing
- Use the language middleware for proper redirects

## 8. CSS and Styling

### 8.1 CSS Framework
- Use Tailwind CSS as the primary styling approach
- Use Mantine components for complex UI elements
- Follow utility-first CSS principles
- Use consistent color naming from the theme
- Add custom styles in `postcss.config.js` when needed

### 8.2 Component Styling
- Use descriptive class names with Tailwind
- Prefer composition over inheritance
- Use responsive design patterns
- Maintain consistent spacing and sizing
- Use Tailwind's color system consistently

## 9. Testing

### 9.1 Test Structure
- Write unit tests for utilities and hooks
- Write component tests for UI behavior
- Place tests alongside the files they test
- Use descriptive test names following "it should..." pattern
- Mock external dependencies in tests

### 9.2 Testing Best Practices
- Mock external dependencies
- Test edge cases
- Keep tests isolated
- Write meaningful assertions
- Follow the Arrange-Act-Assert pattern

## 10. Project-Specific Rules

### 10.1 Student Registration Flow
- Follow the defined registration schema for student data
- Implement proper validation for all student fields
- Store registration data in the appropriate Jotai store
- Support document upload for student applications
- Validate form data before submission

### 10.2 Manager Dashboard
- Implement proper filtering and searching for student lists
- Support status updates with audit trails
- Implement schedule management features
- Handle student verification workflow
- Use consistent status indicators

## 11. Code Review Process

### 11.1 Pre-submission Checklist
- Run TypeScript type checking (`npm run type-check`)
- Verify all tests pass
- Ensure code is properly formatted
- Check for console logs or debugging code
- Verify the code works in both Vietnamese and English interfaces

### 11.2 Review Guidelines
- Review for code logic and correctness
- Check for security implications
- Verify accessibility compliance
- Ensure responsive design works across devices
- Verify proper error handling