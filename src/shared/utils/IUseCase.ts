import { IResponse } from "./IResponse";

export interface IUseCase<Input, Output, ErrorOutput = Error> {
    execute(
        input: Input
    ): Promise<IResponse<Output, ErrorOutput>> | IResponse<Output, ErrorOutput>;
}