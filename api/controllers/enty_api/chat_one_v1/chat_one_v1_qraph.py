data = {
     "nodes": [
            {
                "data": {
                    "desc": "TG AI\u5355\u804a\u8f93\u5165\n\n\u56fa\u5b9a\u8f93\u5165\u5b57\u6bb5\uff1ain_chat_one_v1\n\nin_chat_one_v1 //\u6d88\u606f\u5185\u5bb9\nuser_id        //\u53d1\u9001\u8005tg\u7528\u6237id\naccess_hash    //\u6d88\u606fhash\nuser_name      //\u53d1\u9001\u7740\u540d\u5b57\nphone          //\u53d1\u9001\u8005\u624b\u673a\u53f7\nfirst_name     //\u53d1\u9001\u7740\u6635\u79f0 \u59d3\nlast_name      //\u53d1\u9001\u8005\u6635\u79f0 \u540d\nreceiver       //\u5e73\u53f0\u63a5\u6536\u8005",
                    "selected": False,
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
                        },
                        {
                            "variable": "user_id",
                            "label": "\u53d1\u9001\u8005tg\u7528\u6237id",
                            "type": "paragraph",
                            "max_length": 999,
                            "required": False,
                            "options": []
                        },
                        {
                            "variable": "access_hash",
                            "label": "\u6d88\u606fhash",
                            "type": "paragraph",
                            "max_length": 999,
                            "required": False,
                            "options": []
                        },
                        {
                            "variable": "user_name",
                            "label": "\u53d1\u9001\u8005\u540d\u5b57",
                            "type": "paragraph",
                            "max_length": 999,
                            "required": False,
                            "options": []
                        },
                        {
                            "variable": "phone",
                            "label": "\u53d1\u9001\u8005\u624b\u673a\u53f7",
                            "type": "paragraph",
                            "max_length": 999,
                            "required": False,
                            "options": []
                        },
                        {
                            "variable": "first_name",
                            "label": "\u53d1\u9001\u7740\u6635\u79f0 \u59d3",
                            "type": "paragraph",
                            "max_length": 999,
                            "required": False,
                            "options": []
                        },
                        {
                            "variable": "last_name",
                            "label": "\u53d1\u9001\u8005\u6635\u79f0 \u540d",
                            "type": "paragraph",
                            "max_length": 999,
                            "required": False,
                            "options": []
                        },
                        {
                            "variable": "receiver",
                            "label": "\u5e73\u53f0\u63a5\u6536\u8005",
                            "type": "paragraph",
                            "max_length": 999,
                            "required": False,
                            "options": []
                        }
                    ]
                },
                "dragging": False,
                "height": 476,
                "id": "1711067409646",
                "position": {
                    "x": 211.74111389655582,
                    "y": 239.83720679250615
                },
                "positionAbsolute": {
                    "x": 211.74111389655582,
                    "y": 239.83720679250615
                },
                "selected": False,
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
                            "value_selector": "",
                            "variable": "out_chat_one_v1"
                        }
                    ],
                    "selected": False,
                    "title": "End",
                    "type": "end"
                },
                "height": 114,
                "id": "1711068257370",
                "position": {
                    "x": 583.757446795879,
                    "y": 239.83720679250615
                },
                "positionAbsolute": {
                    "x": 583.757446795879,
                    "y": 239.83720679250615
                },
                "selected": True,
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
