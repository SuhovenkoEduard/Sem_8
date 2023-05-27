export class ValidationNumber {
  value: string;
  isAllowedToBeEmpty: boolean;
  error: string | null;

  constructor(value: string, isAllowedToBeEmpty: boolean = true) {
    this.value = value;
    this.isAllowedToBeEmpty = isAllowedToBeEmpty;
  }

  isEmpty = (message: string = "") => {
    if (this.isAllowedToBeEmpty) {
      return this;
    }

    if (this.value === "") {
      this.error = message;
    }
    return this;
  };

  isNumber = (message: string) => {
    if (this.isAllowedToBeEmpty && this.isEmpty()) {
      return this;
    }

    if (isNaN(+this.value)) {
      this.error = message;
    }
    return this;
  };

  min = (value: number, message: string) => {
    if (this.isAllowedToBeEmpty && this.isEmpty()) {
      return this;
    }

    if (!this.error && +this.value < value) {
      this.error = message;
    }
    return this;
  };

  max = (value: number, message: string) => {
    if (this.isAllowedToBeEmpty && this.isEmpty()) {
      return this;
    }

    if (!this.error && +this.value > value) {
      this.error = message;
    }
    return this;
  };

  getError = () => this.error;
}

export const dailyLogDataValidationObj: {
  [key: string]: (s: string) => string | null;
} = {
  sugarLevel: (sugarLevel: string) =>
    new ValidationNumber(sugarLevel)
      .isEmpty("Уровень сахара не может быть пустым")
      .isNumber("Уровень сахара должен быть числом")
      .min(1.0, "Уровень сахара должен быть больше 1.0 ммоль/л")
      .max(10.0, "Уровень сахара должен быть меньше 10.0 ммоль/л")
      .getError(),
  pulse: (pulse: string) =>
    new ValidationNumber(pulse)
      .isEmpty("Пульс не может быть пустым")
      .isNumber("Пульс должен быть числом")
      .min(50, "Пульс должен быть больше 50 уд/мин")
      .max(110, "Пульс должен быть меньше 110 уд/мин")
      .getError(),
  systolic: (systolic: string) =>
    new ValidationNumber(systolic)
      .isEmpty("Систолическое давление не может быть пустым")
      .isNumber("Систолическое давление должно быть числом")
      .min(90, "Систолическое давление должно быть больше 90 ммрт")
      .max(150, "Систолическое давление должно быть меньше 150 ммрт")
      .getError(),
  diastolic: (diastolic: string) =>
    new ValidationNumber(diastolic)
      .isEmpty("Диастолическое давление не может быть пустым")
      .isNumber("Диастолическое давление должно быть числом")
      .min(50, "Диастолическое давление должно быть больше 50 ммрт")
      .max(110, "Диастолическое давление должно быть меньше 110 ммрт")
      .getError(),
  total: (total: string) =>
    new ValidationNumber(total)
      .isEmpty("Количество каллорий не может быть пустым")
      .isNumber("Количество каллорий должно быть числом")
      .min(200, "Каллорий должно быть больше 200")
      .max(10000, "Каллорий должно быть меньше 10000")
      .getError(),
  weight: (weight: string) =>
    new ValidationNumber(weight)
      .isEmpty("Вес не может быть пустым")
      .isNumber("Вес должен быть числом")
      .min(40, "Вес должен быть больше 40 кг")
      .max(200, "Вес должен быть меньше 200 кг")
      .getError(),
  temperature: (temperature: string) =>
    new ValidationNumber(temperature)
      .isEmpty("Температура не может быть пустой")
      .isNumber("Температура должна быть числом")
      .min(34, "Температура должна быть больше 34 °C")
      .max(42, "Температура должна быть меньше 42 °C")
      .getError(),
};
