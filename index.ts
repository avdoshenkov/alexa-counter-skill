import * as Alexa from 'ask-sdk-core'
import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from 'ask-sdk-core';
import {
    RequestEnvelope,
    Response,
    SessionEndedRequest,
} from 'ask-sdk-model';

let counter = 0;

// Read in the APL documents for use in handlers
const countDocument = require('./screenAPL.json');

// Tokens used when sending the APL directives
const COUNT_TOKEN = 'countToken';

const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "Welcome to your counter! You can ask me to count the numbers and magic will begin. Let's count!";
        const responseBuilder = handlerInput.responseBuilder

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: COUNT_TOKEN,
                document: countDocument,
                datasources: {
                    "countData": {
                        "type": "object",
                        "objectId": "count",
                        "properties": {
                            "counterText": `${counter}`
                        }
                    }
                }
            });
        }
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard("Simple Endelles counter", speechText)
            .getResponse();
    },
}; 

// Skill Invokation Name: 'simple counter skill'
const AskCountIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AskCountIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        counter += 1
        let speechText = `Current counter value is ${counter}`;
        const responseBuilder = handlerInput.responseBuilder

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: COUNT_TOKEN,
                document: countDocument,
                datasources: {
                    "countData": {
                        "type": "object",
                        "objectId": "count",
                        "properties": {
                            "counterText": `${counter}`
                        }
                    }
                }
            });
        }

        return responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Counted!', speechText)
            .getResponse();
    },
};

const CountButtonEventHandler = {
    canHandle(handlerInput: any): boolean {
        // Since an APL skill might have multiple buttons that generate UserEvents,
        // use the event source ID to determine the button press that triggered
        // this event and use the correct handler. In this example, the string 
        // 'counterButton' is the ID we set on the AlexaButton in the document.

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.source.id === 'counterButton';
    },
    handle(handlerInput: HandlerInput) {
        counter += 1;
        let speechText = `Current counter value is ${counter}`;

        const responseBuilder = handlerInput.responseBuilder

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: COUNT_TOKEN,
                document: countDocument,
                datasources: {
                    "countData": {
                        "type": "object",
                        "objectId": "count",
                        "properties": {
                            "counterText": `${counter}`
                        }
                    }
                }
            });
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Counted!', speechText)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput: HandlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: HandlerInput) {
        const speechText = 'You can ask me to count the numbers!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Just count the numbers', speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput: HandlerInput): Response {
        counter = 0;
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hope to see you soon!', speechText)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const SessionEndedRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        console.log(`Session ended with reason: ${(handlerInput.requestEnvelope.request as SessionEndedRequest).reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler: ErrorHandler = {
    canHandle(handlerInput: HandlerInput, error: Error): boolean {
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error): Response {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(`Sorry, I don't understand your command. Please say it again.`)
            .reprompt(`Sorry, I don't understand your command. Please say it again.`)
            .getResponse();
    }
};

let skill: Alexa.Skill;

exports.handler = async (event: RequestEnvelope, context: any) => {
    console.log(`REQUEST++++${JSON.stringify(event)}`);
    if (!skill) {
        skill = SkillBuilders.custom()
            .addRequestHandlers(
                LaunchRequestHandler,
                AskCountIntentHandler,
                CountButtonEventHandler,
                HelpIntentHandler,
                CancelAndStopIntentHandler,
                SessionEndedRequestHandler,
            )
            .addErrorHandlers(ErrorHandler)
            .create();
    }

    const response = await skill.invoke(event, context);
    console.log(`RESPONSE++++${JSON.stringify(response)}`);

    return response;
};