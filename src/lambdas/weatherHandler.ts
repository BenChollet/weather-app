import { APIGatewayProxyResult } from "aws-lambda";
import { GetWeather } from "../domain/useCases/getWeather";
import { WeatherService } from "../application/Weather.service";
import { WeatherRepository } from "../repositories/WeatherRepository";

const repository = new WeatherRepository()
const useCase = new GetWeather(repository)
const service = new WeatherService(useCase)

/**
 * AWS Lambda handler for fetching weather data.
 * @returns {Promise<APIGatewayProxyResult>} The API Gateway response.
 */
export const handler = async (): Promise<APIGatewayProxyResult> => {
    try {
        const response = await service.getWeather();

        if (response.error) throw response.error;

        return {
            statusCode: 200,
            body: JSON.stringify(response.success),
        };
    } catch (error) {
        const baseErrorMessage = 'Error fetching weather';

        console.error(baseErrorMessage, error);
        return {
            statusCode: 500,
            body: baseErrorMessage,
        };
    }
};