const getMockFlow = () => {
    const flow = {
        "description": "Test Parent Flow",
        "states": [
            {
                "name": "q1",
                "type": "send-and-wait-for-reply",
                "transitions": [
                    {
                        "next": "q1_split",
                        "event": "incomingMessage"
                    },
                    {
                        "next": "postresponses_noreply",
                        "event": "timeout"
                    },
                    {
                        "event": "deliveryFailure"
                    }
                ],
                "properties": {
                    "offset": {
                        "x": 120,
                        "y": 1030
                    },
                    "service": "{{trigger.message.InstanceSid}}",
                    "channel": "{{trigger.message.ChannelSid}}",
                    "from": "{{flow.channel.address}}",
                    "body": "Which of these descriptions best applies to what you have been doing for the last four weeks?   Please respond with the number of your response.\n1. In paid work\n2. In school\n3. Unemployed and actively looking for a job\n4. Unemployed and not actively looking for a job\n5. Other",
                    "timeout": 3600
                }
            },
            {
                "name": "q1_error",
                "type": "send-message",
                "transitions": [
                    {
                        "next": "q1",
                        "event": "sent"
                    },
                    {
                        "event": "failed"
                    }
                ],
                "properties": {
                    "offset": {
                        "x": -540,
                        "y": 1270
                    },
                    "service": "{{trigger.message.InstanceSid}}",
                    "channel": "{{trigger.message.ChannelSid}}",
                    "from": "{{flow.channel.address}}",
                    "to": "{{contact.channel.address}}",
                    "body": "I’m sorry, I did not understand your response. Please try again."
                }
            },
            {
                "name": "q1_help",
                "type": "send-message",
                "transitions": [
                    {
                        "next": "q1",
                        "event": "sent"
                    },
                    {
                        "event": "failed"
                    }
                ],
                "properties": {
                    "offset": {
                        "x": 1030,
                        "y": 1270
                    },
                    "service": "{{trigger.message.InstanceSid}}",
                    "channel": "{{trigger.message.ChannelSid}}",
                    "from": "{{flow.channel.address}}",
                    "to": "{{contact.channel.address}}",
                    "body": "If you need additional support to complete the survey."
                }
            }
        ],
        "initial_state": "Trigger",
        "flags": {
            "allow_concurrent_calls": true
        }
    }
    return flow;
}

const getRandomString = (length = 10,
    charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") => {
    let randomNewEntryName = "";

    for (let i = 0; i < length; i++) {
        const randomPos = Math.floor(Math.random() * charSet.length);
        randomNewEntryName += charSet.substring(randomPos, randomPos + 1);
    }

    return randomNewEntryName;
};

const getMockFlowWithNewEntry = () => {
    const flow = getMockFlow();
    const randomNewEntryName = getRandomString(10);
    const newQuestion = { ...flow.states[0], name: randomNewEntryName };

    flow.states.push(newQuestion);
    return { flow, newEntry: randomNewEntryName };
};

module.exports = { getMockFlow, getMockFlowWithNewEntry };