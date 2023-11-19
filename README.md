# FSD Components

The FSD Components extension provides an easy way to create React components (for now) using the context menu.

You can change the component template for a workspace using the "FSD Components: Edit Component Template" command. To change the standard template for a user, you need to specify its key in User settings -> feature-sliced-design-components: Component Template.

## The component template has the following structure:

```
  exampleComponent: {
    "folder": {
        "index": "indexContent"
    }
    "file.tsx": "fileContent"
  }
```

Default component template

```
  exampleComponent: {
    'ComponentName.tsx':
      "import { IComponentNameProps } from './ts';\n\nconst ComponentName = ({ ...props }: IComponentNameProps) => {\n  return <div {...props}>{'ComponentName'}</div>;\n};\n\nexport default ComponentName;\n",
    'index.ts':
      "export { default as ComponentName } from './ComponentName';\nexport type * from './ts';\n",
    ts: {
      'index.ts': "export type * from './interfaces';\n",
      'interfaces.ts': 'export interface IComponentNameProps {}\n',
    },
  }
```
