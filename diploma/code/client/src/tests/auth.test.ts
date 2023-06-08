export {}

describe("Тестирование маршрута бизнес логики /auth", () => {
  describe("Подмаршрут /patient-sign-up", () => {
    it("Проверка успешной регистрации пациента", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /relative-sign-up", () => {
    it("Проверка успешной регистрации родственника", () => expect(true).toBe(true))
    it("Проверка существования пациента по коду приглашения ", () => expect(true).toBe(true))
  })
  describe("Подмаршрут /sign-in", () => {
    it("Проверка входа", () => expect(true).toBe(true))
  })
})
