(function () {
  require('../src');

  describe('api.basic test', () => {
    test('nx.parseInt shold return array list', function () {
      const arr = [1, '2a', '3b', '4c'];
      const res = arr.map(nx.parseInt);
      expect(res).toEqual([1, 2, 3, 4]);
    });
  });
})();
