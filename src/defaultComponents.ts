export const defaultComponents = {
  defaultComponent: {
    'ComponentName.tsx':
      "import { IComponentNameProps } from './ts';\n\nconst ComponentName = ({ ...props }: IComponentNameProps) => {\n  return <div {...props}>{'ComponentName'}</div>;\n};\n\nexport default ComponentName;\n",
    'index.ts':
      "export { default as ComponentName } from './ComponentName';\nexport type * from './ts';\n",
    ts: {
      'index.ts': "export type * from './interfaces';\n",
      'interfaces.ts': 'export interface IComponentNameProps {}\n',
    },
  },
};
