import { Weather } from "../entities/Weather";

export interface IWeatherRepository {
    getWeather(): Promise<Weather>;
}