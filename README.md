# Weather App

Basic weather application that fetches weather data from an opensource weather API and store it hourly in a DynamoDB table.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Usage](#usage)
- [Project](#project)

## Prerequisites

- Node.js (v14.x or later)
- AWS CLI configured with appropriate IAM role permissions
- An AWS account with access to Lambda, DynamoDB, and S3

## Configuration

1. Create a `.env` file in the root directory and add your OpenWeather API key:
    ```dotenv
    OPEN_WEATHER_API_KEY=your_openweather_api_key
    WEATHER_TABLE_NAME=Weather
    ```
   
## Deployment

1. Compile the TypeScript code and package the Lambda function:
    ```sh
    npm run deploy-lambda
    ```
   
2. Deploy the CloudFormation stack:
    ```sh
   aws cloudformation deploy --template-file infrastructure/cloudformation.yml --stack-name [APP_NAME] --parameter-overrides OpenWeatherApiKey=[YOUR_API_KEY] DynamoDBTableName=[TABLE_NAME] S3BucketName=[BUCKET_NAME] S3Key=[BUCKET_KEY] --capabilities CAPABILITY_NAMED_IAM
    ```
   
## Usage

Once deployed, the Lambda function can be invoked via the API Gateway endpoint.

   ```sh
   curl -X GET https://[API_ID].execute-api.[REGION].amazonaws.com/[STAGE]/weather
   ```

Exemple with my App :

   ```sh
   curl -X GET https://tg71dak42l.execute-api.us-west-1.amazonaws.com/development/weather
   ```

## Project

Design decisions and project structure:

**Separation of Concerns:**
The application is divided into distinct layers: application services, domain entities, use cases, and repositories. This separation ensures that each layer has a clear responsibility, making the codebase easier to maintain and extend.

**Dependency Injection:**
The use of dependency injection allows for better testability and flexibility. For example, the WeatherService class depends on the GetWeather use case, which in turn depends on the WeatherRepository.
(Sorry no time for tests)

**Mix DDD and Hexagonal Architecture**

1 - Domain-Driven Design (DDD)

   *Domain Layer*: 
      **entities**: Contains the core business objects (Weather).
      **useCase**s: Contains the application logic (GetWeather).
      **repositories**: Defines repository interfaces (IWeatherRepository).

   *Application Layer*: 
      **application**: Contains services that orchestrate use cases (WeatherService).

   *Infrastructure Layer*: 
      **repositories**: Implements repository interfaces (WeatherRepository).
      **infrastructure**: Contains infrastructure-related configurations (cloudformation.yml).

1 - Hexagonal Architecture

   *Core*: 
      The domain layer represents the core business logic, independent of external systems
   
   *Ports and Adapters*:
      **Ports**: Defined by interfaces in the domain/repositories and domain/useCases.
      **Adapters**: Implemented in the repositories (WeatherRepository).
   
This structure ensures a clear separation of concerns, making the codebase maintainable and scalable.