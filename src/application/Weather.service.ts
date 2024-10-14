import { GetWeather } from "../domain/useCases/getWeather";

export class WeatherService {
    constructor(private readonly getWeatherUseCase: GetWeather) {}

    async getWeather() {
        return this.getWeatherUseCase.execute();
    }
}