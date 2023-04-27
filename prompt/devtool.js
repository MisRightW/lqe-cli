export default () => ({
  type: 'list',
  name: 'devtool',
  message: 'set devtool',
  default: 'eval-cheap-module-source-map',
  choices: [
    { value: 'eval-cheap-module-source-map', name: 'eval-cheap-module-source-map' },
    { value: 'eval-cheap-source-map', name: 'eval-cheap-source-map' },
    { value: 'eval-source-map', name: 'eval-source-map' },
  ]
})
