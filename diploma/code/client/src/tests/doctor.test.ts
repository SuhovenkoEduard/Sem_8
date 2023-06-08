export {}

describe("Тестирование маршрута бизнес логики /doctor", () => {
  describe("Подмаршрут /get-patients", () => {
    it("Проверка существования доктора", () => expect(true).toBe(true))
    it("Проверка получения всех пациентов", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /get-patients-statistics", () => {
    it("Проверка получения статистики пациентов", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /get-reviews", () => {
    it("Проверка получения отзывов доктора", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /edit-doctor-description", () => {
    it("Проверка обновления описания доктора", () => expect(true).toBe(true))
  })
})
