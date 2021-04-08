export default {
  resolve: jest.fn().mockReturnValue('resolved-path'),
  join: jest.fn().mockReturnValue('joined-path')
}
