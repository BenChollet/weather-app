import { DynamoDB } from "aws-sdk";
import axios from "axios";

import { Weather } from "../domain/entities/Weather";
import { IWeatherRepository} from "../domain/repositories/Weather.interface";

/**
 * Repository handling weather data actions.
 * @implements {IWeatherRepository}
 */
export class WeatherRepository implements IWeatherRepository {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly dynamoDb: DynamoDB.DocumentClient;
    private readonly tableName: string;

    constructor() {
        this.apiKey = process.env.OPEN_WEATHER_API_KEY || "";
        this.baseUrl = "https://api.openweathermap.org/data/2.5/weather";
        this.dynamoDb = new DynamoDB.DocumentClient();
        this.tableName = process.env.WEATHER_TABLE_NAME || "Weather";
    }

    /**
     * Retrieves weather data from DynamoDB.
     * @param {string} key - The key for the weather data.
     * @returns {Promise<Weather | null>} The weather data or null if not found.
     */
    private async getWeatherFromDb(key: string): Promise<Weather | null> {
        const params = {
            TableName: this.tableName,
            Key: { city: key },
        };

        const response = await this.dynamoDb.get(params).promise();
        if (!response.Item) return null;

        return new Weather(response.Item.temperature, response.Item.description);
    }

    /**
     * Saves weather data to DynamoDB.
     * @param {string} key - The key for the weather data.
     * @param {Weather} weather - The weather data to save.
     * @returns {Promise<void>}
     */
    private async saveWeatherInDb(key: string, weather: Weather): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                city: key,
                temperature: weather.temperature,
                description: weather.description,
            },
        };

        await this.dynamoDb.put(params).promise();
    }

    /**
     * Retrieves weather data in Paris, if not found in the database, fetches it from the API.
     * @returns {Promise<Weather>} The weather data.
     */
    async getWeather(): Promise<Weather> {
        const city = "Paris";
        const currentHour = new Date().getHours();
        const cachedKey = `${city}-${currentHour}`;

        const weatherFromDb = await this.getWeatherFromDb(cachedKey);
        if (weatherFromDb) return weatherFromDb;

        const formattedUrl = `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=Metric`;

        const response = await axios.get(formattedUrl);
        const { data } = response;
        const weatherData = new Weather(data.main.temp, data.weather[0].description);

        await this.saveWeatherInDb(cachedKey, weatherData);

        return weatherData;
    }
}