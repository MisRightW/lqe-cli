export default () => ({
  type: 'list',
  name: 'installTool',
  message: 'set Nodejs package manage',
  default: 'yarn',
  choices: [
    { name: 'yarn' },
    { name: 'npm' }
  ]
})
