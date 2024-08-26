data = {
    "nodes": [
        {
            "data": {
                "desc": "TG AI\u5355\u804a\u8f93\u5165\n\n\u56fa\u5b9a\u8f93\u5165\u5b57\u6bb5\uff1ain_chat_one_v1",
                "selected": True,
                "title": "Start",
                "type": "start",
                "variables": [
                    {
                        "label": "\u5355\u804a\u8f93\u5165",
                        "max_length": None,
                        "options": [],
                        "required": True,
                        "type": "paragraph",
                        "variable": "in_chat_one_v1"
                    }
                ]
            },
            "dragging": False,
            "height": 150,
            "id": "1711067409646",
            "position": {
                "x": 30,
                "y": 245
            },
            "positionAbsolute": {
                "x": 30,
                "y": 245
            },
            "selected": True,
            "sourcePosition": "right",
            "targetPosition": "left",
            "type": "custom",
            "width": 244
        },
        {
            "data": {
                "desc": "TG AI\u5355\u804a\u8f93\u51fa\n\n\u56fa\u5b9a\u8f93\u51fa\u5b57\u6bb5out_chat_one_v1",
                "outputs": [
                    {
                        "value_selector": [
                            "1711067409646",
                            "in_chat_one_v1"
                        ],
                        "variable": "out_chat_one_v1"
                    }
                ],
                "selected": False,
                "title": "End",
                "type": "end"
            },
            "height": 150,
            "id": "1711068257370",
            "position": {
                "x": 471.4028391020328,
                "y": 245
            },
            "positionAbsolute": {
                "x": 471.4028391020328,
                "y": 245
            },
            "selected": False,
            "sourcePosition": "right",
            "targetPosition": "left",
            "type": "custom",
            "width": 244
        }
    ],
    "edges": [
        {
            "id": "1711067409646-source-1711068257370-target",
            "type": "custom",
            "source": "1711067409646",
            "target": "1711068257370",
            "sourceHandle": "source",
            "targetHandle": "target",
            "data": {
                "sourceType": "start",
                "targetType": "end",
                "isInIteration": False
            },
            "zIndex": 0
        }
    ],
    "viewport": {
        "x": 296.6867118590277,
        "y": 215.35488934711407,
        "zoom": 0.8894276432818409
    }
}
