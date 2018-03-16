import React from 'react';
import { StyleSheet } from 'react-native';
import {
	Content, Container, Right, Button, Text, Card, ListItem, View, Touchable, Left, Body, Title, Nav, List, Thumbnail,
	FlowList, withUser, Header, CheckBox, SwipeRow, Icon
} from '../../components';
import { YIcon } from '../../assets';
import { transformSize, textPrimaryColor } from '../../styles';
import WitkeyItem from '@components/containers/WitkeyItem'
import { http } from '@services'

@withUser(true)
export default class CollectWike extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			animating: false,
			check: false,
			showText: "编辑",
			data: []
		};
	}

	renderItem = ({ item }) => {
		return (
			<View style={styles.item}>
				{
					this.checkGroup(item)
				}
				<WitkeyItem selected={() => this.props.navigation.navigate('WitkeyDetail', { item })} style={styles.item} data={item} />
			</View>
		);
	}
	render() {
		return (
			<Container>
				<Header>
					{this.titleLeft()}
					<Body>
						<Title>我收藏的威客</Title>
					</Body>
					{this.titleRight()}
				</Header>
				<Content>
					<FlowList
						disabledPage={true}
						renderItem={this.renderItem.bind(this)}
						request='/services/app/v1/witkey/getFollowWitkeys/1/100000'
						NoMoreDataComponent={null}
					/>
				</Content>

			</Container>
		);
	}

	// CheckBox复选框显示隐藏
	checkGroup = (item) => {
		if (!this.state.animating) {
			return (
				<CheckBox onPress={() => this.checked.bind(item)}
					style={item.id ? styles.mainCheck : styles.oldCheck} checked={!true} />
			)
		} else {
			null
		}
	}

	// 判断当前状态是否为筛选，不为筛选则点击列表跳转页面到详情
	// CheckBoxShow(item) {
	// 	if (this.state.animating) {
	// 		return (
	// 			this.checked(item)
	// 		)

	// 	} else {
	// 		return (
	// 			() => this.props.navigation.navigate("WitkeyDetail", item)
	// 		)
	// 	}
	// }

	// 头部导航自定义
	_handleBack = () => {
		if (this.state.animating) {
			this.setState({
				animating: false,
			})
		} else {
			this.props.navigation.goBack();
		}
	};

	titleLeft = () => {
		let leftContent = this.state.animating ? <Text>取消</Text> : <YIcon name="arrow-back" style={styles.arrowBack} />;
		return (
			<Left>
				<Button transparent onPress={() => this._handleBack()} dark>
					{leftContent}
				</Button>
			</Left>
		);
	}

	titleRight = () => {
		return (
			<Right>
				<Button transparent dark>
					{this.rightText()}
				</Button>
			</Right>
		)

	}
	// 控制导航右边显示状态
	rightText = () => {
		if (this.state.animating) {
			return (
				<Text onPress={() => this.deleteClick()} style={{ color: "#caa00d" }}>删除</Text>
			)
		} else {
			return (
				<Text onPress={() => this.editClick()} style={{ color: "#caa00d" }}>编辑</Text>
			)
		}
	}

	editClick = () => {
		this.setState({
			animating: true,
		});

	}
	// 操作批量删除
	deleteClick = () => {
		alert(1)
	}

}



const styles = StyleSheet.create({
	item: {
		width: '100%',
		flex: 1

	},
	mainCheck: {
		marginTop: transformSize(-120),
		marginRight: transformSize(65),
		backgroundColor: '#fb4545',
		borderColor: '#fb4545'
	},
	oldCheck: {
		marginTop: transformSize(-120),
		marginRight: transformSize(65),
		backgroundColor: '#fff',
		borderColor: '#999'
	},

});