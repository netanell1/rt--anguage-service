# RT Language Service

## Overview

`RT Language Service` is a Visual Studio Code extension designed to enhance the development experience for users of the `react-cli-rt` npm package. This extension provides auto-completion, validation, and syntax highlighting for template files and configuration files, making it easier to build React components efficiently.

## Features

- **Auto-completion**: Get suggestions for properties defined in `rt.json`, ensuring you use the correct keys and values.
- **Template Variable Completion**: Automatically complete common variables in your template files, including:
  - `functionName`
  - `componentName`
  - `styleFileName`
- **Validation**: Real-time validation for your template files, highlighting any errors related to allowed variable names within double curly braces `{{ }}`.
- **Syntax Highlighting**: Enhanced syntax highlighting for both `component-rt.template` and `style-rt.template` files, helping to visually distinguish elements in your code.

## Installation

To install the extension, follow these steps:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side or pressing `Ctrl+Shift+X`.
3. Search for `RT Language Service` and click `Install`.

## Usage

Once the extension is installed, you can create and edit files with the `.component-rt.template` and `.style-rt.template` extensions. The extension will automatically provide:

- Suggestions as you type properties defined in `rt.json`.
- Completion for the defined variables within your templates.

### Example

```javascript
export default function {{functionName}} ({}) {
  return (
    <p>{{componentName}} works!</p>
  )
};
```
