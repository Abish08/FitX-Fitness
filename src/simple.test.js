// Simple test to verify Jest is working
describe('Jest Setup', () => {
  test('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should test string methods', () => {
    const message = 'Hello FitX Fitness';
    expect(message).toContain('FitX');
    expect(message.toLowerCase()).toBe('hello fitx fitness');
  });
});