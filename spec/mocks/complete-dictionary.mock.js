module.exports = () => {
    const dictionary = {
        "title": "Test dictionary",
        "q1": {
            "type": "send-and-wait-for-reply",
            "dictionary": {
                "EN": {
                    "text": "Select option A-E",
                    "option-1": "1. A",
                    "option-2": "2. B",
                    "option-3": "3. C",
                    "option-4": "4. E"
                },
                "ES-US": {
                    "text": "ES - Select option A-E",
                    "option-1": "1. A",
                    "option-2": "2. B",
                    "option-3": "3. C",
                    "option-4": "4. E"
                },
                "FR": {
                    "text": "FR - Select option A-E",
                    "option-1": "1. A",
                    "option-2": "2. B",
                    "option-3": "3. C",
                    "option-4": "4. E"
                }
            }
        },
        "q1_error": {
            "type": "send-and-wait-for-reply",
            "dictionary": {
                "EN": {
                    "text": "I’m sorry, I did not understand your response. Please try again."
                },
                "ES-US": {
                    "text": "ES - I’m sorry, I did not understand your response. Please try again."
                },
                "FR": {
                    "text": "FR - I’m sorry, I did not understand your response. Please try again."
                }
            }
        },
        "q1_help": {
            "type": "send-and-wait-for-reply",
            "dictionary": {
                "EN": {
                    "text": "If you need additional support to complete the survey..."
                },
                "ES-US": {
                    "text": "ES - If you need additional support to complete the survey..."
                },
                "FR": {
                    "text": "FR - If you need additional support to complete the survey..."
                }
            }
        }
    }

    return dictionary;
}