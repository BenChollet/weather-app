import { IWeatherRepository } from "../repositories/Weather.interface";

import { IResponse } from "../../shared/utils/IResponse";
import { IUseCase } from "../../shared/utils/IUseCase";
import { Weather } from "../entities/Weather";

type Input = void;

type Output = Weather

/**
 * Use case for getting weather data in Paris.
 * @implements {IUseCase}
 */
export class GetWeather implements IUseCase<Input, Output> {
    /**
     * @param {IWeatherRepository} weatherRepository - The weather repository.
     */
    constructor(private readonly weatherRepository: IWeatherRepository) {
    }

    /**
     * Executes the use case.
     * @returns {Promise<IResponse<Weather>>} The weather data.
     */
    async execute(): Promise<IResponse<Output>> {
        return {
            success: await this.weatherRepository.getWeather(),
            error: null,
        };
    }
}