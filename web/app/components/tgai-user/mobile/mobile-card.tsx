'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Input, Message, Popconfirm, Popover, Spin, Table, Typography,Modal,Select } from '@arco-design/web-react'
import { IconCheckCircle } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { useState,useRef,useEffect } from 'react'
import { getMobileControlList ,getTypesInfoList,controlPushTask,getWorkflowAll,getBindingWorkflowView,postBindingWorkflowUpdate} from '@/service/mobile'
import style from './mobile.module.css'
import classNames from '@/utils/classnames'
export const AccountCard = () => {
    const [visible, setVisible] = useState(false);
    const [clickType, setClickType] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editInpId, setEditInpId] = useState('');
    const [inpForm, setInpForm] = useState({});
    const [visible2, setVisible2] = useState(false);
    const [inpList, setinpList] = useState([]);
    const [inputValues, setInputValues] = useState(Array(inpList.length).fill(''));
    const [taskList, setTaskList] = useState([]);
    const [workflowName, setTWorkflowName] = useState([]);
    const [editInpList, setEditInpList] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    let editInpIdStr = useRef('')
    let editTitleStr = useRef('')
    let clickTypeStr = useRef('')
    let workflow_name = useRef('')
    let inpFormObj = useRef({})
    let taskListArr = useRef([])
    let workflowArr = useRef([])
    let inputValuesArr = useRef([])
    const Option = Select.Option;
    const operate = (item: any) => {
        inpFormObj.current = {
            device_id:[item.device_id],
            machine_id:item.machine_id,
        }
        setVisible(true)
    }
    const batchOperate =async (item:any) => {
        const task_arr = taskList.map(item => {
            const { editTitle, ...rest } = item as any;
            return rest;
        });
        let data = {
            device_id:[item.device_id],
            machine_id:item.machine_id,
            task_arr
        }
        setLoading2(true)
        const res = await controlPushTask(data)
        Message.success('提交成功')
        setLoading2(false)
        if(clickTypeStr.current=='2'){
            setVisible(false)
        }
    }
    let newList = []
    const getInpList = (item:any,type:any) => {
        console.log(item);
        // 清空所有input值
        setInputValues(Array(inpList.length).fill(''));
        editInpIdStr.current = item.id
        editTitleStr.current = item.tip
        inputValuesArr.current = []
        setinpList(item.input)
        clickTypeStr.current = type
        if(item.input.length >0){
            setinpList(item.input)
            setVisible2(true)
        }else{
            if(type=='2'){
                setLoading(true)
            }
            setinpList([])
            submitInp()
        }
        
     }
     const delTaskList = (index:any) => {
        const newTaskList = [...taskList.slice(0, index), ...taskList.slice(index + 1)];
        // 更新状态
        setTaskList(newTaskList);
     }
     const delAllTaskList = () => {
        setTaskList([])
        // taskListArr.current = []
     }
     const handleInputChange = (e:any, index:any,item:any) => {
        const updatedValues = [...inputValues];
        updatedValues[index] = e;
        setInputValues(updatedValues);
        (inputValuesArr.current[index] as any) = {
            [item]:e
        } as any;
    };
     const submitInp = async () => {
        if(clickTypeStr.current == '1'){
            let obj = {
                task_type:editInpIdStr.current+'',
                editTitle:editTitleStr.current,
                task_json_str:inputValuesArr.current.length>0?JSON.stringify(Object.assign({}, ...inputValuesArr.current)):'',
            }
            setTaskList(prevTaskList => [...prevTaskList, obj] as any);
        }else if(clickTypeStr.current == '2'){
            let data = {
                device_id:[inpFormObj.current.device_id],
                machine_id:inpFormObj.current.machine_id,
                task_arr:[{task_type:editInpIdStr.current+'',task_json_str:inputValuesArr.current.length>0?JSON.stringify(Object.assign({}, ...inputValuesArr.current)):'',}]
            }
            const res = await controlPushTask(data)
            Message.success('提交成功')
            setVisible(false)
            setLoading(false)
        }
        setVisible2(false)
     }
     const cancelInp = () => {
        setVisible2(false)
    }
     const btnClick = async () => {
        let data = {
            workflow_id:selectedValue
        }
        const res = await postBindingWorkflowUpdate(data)
        Message.success('绑定成功')
        setSelectedValue(selectedValue)
        workflow_name.current = selectedValue
    }
    const handleChange = (value:any) => {
       
        setSelectedValue(value);
    }
    const { data: res, } = useSWR(['/workflow/all'], getWorkflowAll)
    const { data: res2, } = useSWR(['/control/bindingWorkflowView'], getBindingWorkflowView)
    let str = res2?.data?.workflow_id || ''
    useEffect(() => {
        setSelectedValue(str)
    }, [str]);
    workflowArr.current = res?.data.workflow_array
    const { data: allAccountData, } = useSWR(['/control/list'], getMobileControlList)
    const { data: InfoList, } = useSWR(['/control/getTypesInfoList'], getTypesInfoList)
    const items = InfoList?.data.list
    const columns = [
        {
            title: '设备ID',
            dataIndex: 'device_id',
        },
        {
            title: '状态',
            dataIndex: 'status_ready',
            render: (col:any) => {
                if(col){
                    return '就绪'
                }else{
                    return '未就绪'
                }
            }
        },
        {
            title: '当前执行中',
            dataIndex: 'task_list',
            render: (col:any) => {
                const arr = col?[...col]:[]
                return arr.map((item)=> <span>{item.task_type_zh}</span>)
            }
            
        },
        {
            title: '待确认操作',
            dataIndex: 'b',
        },
        {
            title: '操作',
            render: (_col:any, item:any) =>
                <div className='flex flex-row flex-wrap gap-2'>
                    <Button type='primary' onClick={() => operate(item)}>单次操作</Button>
                    <Button type='primary' loading={loading2} disabled={taskList.length<=0} onClick={() => batchOperate(item)}>批量操作</Button>
                </div>
        },
    ]

    return (
        <Card className={'px-4'}>
            <div className={style.wrap}>
                <div className={style.wrapBox}>
                    <Typography.Title heading={5}>物理矩阵</Typography.Title>
                    <Divider />
                    <div className={style.dropDown}>
                        矩阵任务配置：
                        <Select
                            placeholder='请选择矩阵任务'
                            style={{ width: 250 }}
                            onChange={handleChange}
                            value={selectedValue}
                            >
                            {workflowArr.current?.map((option:any, index) => (
                                <Option key={option.workflow_id} value={option.workflow_id}>
                                    {option.workflow_name}
                                </Option>
                            ))}
                        </Select>
                        <Button onClick={() =>btnClick()} className={style.dropBtn} type='primary'>确认</Button>
                    </div>

                    <Divider />
                    <div className={style.title}>
                        机器ID：{allAccountData?.data?.machine_id_list?.join(',')||'-'}
                    </div>
                    <Table columns={columns} data={allAccountData ? allAccountData.data?.N5BKHKF0FBEECTJX : undefined} pagination={false} rowKey={'device_id'} />
                </div>
                <div className={classNames(style.wrapBoxR, "dark:!border-neutral-600")}>
                    <div className={style.flexBox}>
                        <h5>编辑操作流程</h5>
                        <Button onClick={() =>delAllTaskList()} type='primary'>清除</Button>
                    </div>
                    <Divider />
                    <div className={style.box}>
                        <div className={style.top}>
                            {items?.map((item:any)=>(
                                <div onClick={() =>getInpList(item,1)} key={item.id} className={classNames(style.topBox, "dark:!border-neutral-600")}>
                                    <h4>{item.tip}</h4>
                                </div>
                            ))}
                        </div>
                        {taskList.length>0&&
                            <div className={style.main}>
                                <h5>编辑区域</h5>
                                <div className={classNames(style.content, "tgai-custom-scrollbar")}>
                                {taskList?.map((item:any,index:any)=>(
                                    <div key={item.id} className={classNames(style.box, "dark:!border-neutral-600")}>
                                        <div className={style.boxTop}>
                                            <h6>{item.editTitle}</h6>
                                            <Button onClick={() =>delTaskList(index)} size='mini' type='primary' status='danger'>删除</Button>
                                        </div>
                                        <p>{item.task_json_str}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            
                <Modal
                    title='编辑操作流程'
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    visible={visible}
                    autoFocus={false}
                    focusLock={true}
                    footer={null}
                >
                    <Spin loading={loading}  style={{ display: 'block', marginTop: 8, }}>
                        <div className={classNames(style.box, "dark:border-neutral-600")}>
                            <div className={style.top}>
                                {items?.map((item:any)=>(
                                    <div onClick={() =>getInpList(item,2)} key={item.id} className={style.topBox}>
                                        <h4>{item.tip}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Spin>
                </Modal>
            <Modal
                title={editTitleStr.current}
                onOk={() => submitInp()}
                onCancel={() =>cancelInp()}
                visible={visible2}
                autoFocus={false}
                focusLock={true}
            >
                <div className={style.inputWrap}>
                    {inpList.map((item,index)=>(
                        <div key={item} className={style.inputBox}>
                            <h6>{item}</h6>
                            <Input value={inputValues[index]} onChange={(event) => handleInputChange(event, index,item)} placeholder={item} />
                        </div>
                    ))}
                </div>
            </Modal>
        </Card>
    )
}
