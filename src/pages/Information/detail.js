import React, { PureComponent } from 'react';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { generateShowHourMinuteSecond } from 'antd/lib/time-picker';
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ information, loading }) => ({
  information,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var submitData = values;
        submitData.content = values.content.toHTML();
        if (this.props.match.params.id != 'new') {
          dispatch({
            type: 'information/edit',
            payload: {
              id: this.props.match.params.id,
              data: submitData
            },
          });
        }
        else {
          dispatch({
            type: 'information/creat',
            payload: {
              id: this.props.match.params.id,
              data: submitData
            },
            callback: () => {
              router.replace('/informations')
            }
          });
        }
        
      }
    });
  };

  componentDidMount() {
    console.info(this.props);
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    if (this.props.match.params.id != 'new' && this.props.match.params.id > 0) {
      dispatch({
        type: 'information/show',
        payload: {
          id: this.props.match.params.id,
        },
        callback: response => {
          console.info(response);
          setFieldsValue({
            ...response.data,
            content: BraftEditor.createEditorState(response.data.content)
          });
          
        },
      });
    }
  }

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      // labelCol: {
      //   xs: { span: 24 },
      //   sm: { span: 7 },
      // },
      // wrapperCol: {
      //   xs: { span: 24 },
      //   sm: { span: 12 },
      //   md: { span: 10 },
      // },
    };

    const submitFormLayout = {
      // wrapperCol: {
      //   xs: { span: 24, offset: 0 },
      //   sm: { span: 10, offset: 7 },
      // },
    };

    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media' ];

    return (
      <PageHeaderWrapper
        title= {this.props.match.params.id === 'new' ? '新建资讯' : '编辑资讯'}
        // content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="文章正文">
            {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback()
                  }
                }
              }],
            })(
              <BraftEditor
                className="my-editor"
                style={{
                  border:'1px solid #d9d9d9',
                  borderRadius:'4px'}}
                // controls={controls}
                placeholder="请输入正文内容"
              />
            )}
          </FormItem>
            <FormItem {...formItemLayout} label="摘要">
              {getFieldDecorator('abstract', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
              })(<Input placeholder='默认截取文章内容前20个字'/>)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
