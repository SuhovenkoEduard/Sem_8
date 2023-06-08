export {}

describe("Тестирование маршрута бизнес логики /dialogs", () => {
  describe("Подмаршрут /get-dialogs", () => {
    it("Проверка существования аккаунта", () => expect(true).toBe(true))
    it("Проверка получения всех диалогов", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /get-messages", () => {
    it("Проверка существования диалога", () => expect(true).toBe(true))
    it("Проверка получения всех сообщений диалога", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /send-message", () => {
    it("Проверка существования диалога", () => expect(true).toBe(true))
    it("Проверка обновления сообщений диалога", () => expect(true).toBe(true))
  })
})
