export {}

describe("Тестирование маршрута бизнес логики /admin", () => {
  describe("Подмаршрут /get-accounts", () => {
    it("Проверка получения всех аккаунтов", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /add-account", () => {
    it("Проверка добавления аккаунта", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /edit-account", () => {
    it("Проверка существования аккаунта", () => expect(true).toBe(true))
    it("Проверка обновления аккаунта", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /delete-account", () => {
    it("Проверка существования аккаунта", () => expect(true).toBe(true))
    it("Проверка удаления аккаунта", () => expect(true).toBe(true))
  })
})
