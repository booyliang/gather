import React from 'react';
import { StyleSheet } from 'react-native';
import {
	Content, Container, Right, Button, Text, Card, ListItem, View, Touchable, Left, Body, Title, Nav, List, Thumbnail,
	FlowList, withUser,Header,CheckBox
} from '../../components';
import { YIcon } from '../../assets';
import { transformSize, textPrimaryColor } from '../../styles';
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
			<ListItem onPress={() => this.CheckBoxShow(item)}>
				{this.CheckBox(item)}
				<Thumbnail square size={250} source={{ uri: item.companyLogo }} style={styles.leftImg} />
				<Body style={styles.content}>
					<Text style={styles.title}>{item.companyName}</Text>
					<Text style={[styles.contentItem]}>服务领域: {item.commentValueName}</Text>
					<Text style={[styles.contentItem]}>服务类型:{item.companyTypeName}</Text>
					<Text style={[styles.contentItem, styles.bold]}>公司性质:{item.outSourceName}</Text>
					<View style={styles.siteWrapper}>
						<YIcon name="add-a-c" style={{ fontSize: transformSize(40) }}></YIcon>
						<Text note style={styles.site}>{item.companyAddress}</Text>
					</View>
				</Body>
			</ListItem>

		);
	}
	render() {
		return (
			<Container style={styles.contMain}>
				{/* <Nav title='我收藏的威客'></Nav> */}
				<Header>
					{this.AttentionLeft()}
					<Body>
						<Title>我收藏的威客</Title>
					</Body>
					{this.AttentionRight()}
				</Header>
				<Content>
					<List style={styles.main}>
						<FlowList 
						renderItem={this.renderItem} 
						request='/services/app/v1/witkey/getFollowWitkeys'
						fetchData={this.Wikelist.bind(this)}
						/>
					</List>
				</Content>

			</Container>
		);
	}

	// 复选框显示隐藏

	CheckBox(item) {
		if (this.state.animating) {
			return (
				<CheckBox 
				style={item.checkBOx ? styles.mainCheck : styles.oldCheck} checked={item.checkBOx} />
			)
		}
		
	}

	AttentionLeft = () => {
		let leftContent = this.state.animating ? <Text>取消</Text> : <YIcon name="arrow-back" style={styles.arrowBack} />;
		return (
			<Left>
				<Button transparent onPress={this._handleBack.bind(this)} dark>
					{leftContent}
				</Button>
			</Left>
		);
	}

	AttentionRight = () => {
			return (
				<Right>
					<Button transparent dark>
						{this.state.animating?<Text onPress={this.datleClick.bind(this)} style={{ color: "#caa00d" }}>删除</Text>:<Text onPress={this.editClick.bind(this)} style={{ color: "#caa00d" }}>编辑</Text>}
					</Button>
				</Right>
			)
		}

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
	// 点击编辑改变导航返回状态为取消
	editClick() {
		this.setState({
			animating: true,
		})
	}
	// 点击删除遍历当前选中的元素，删除
	datleClick() {

		
	}
	// 更改数据结构
	async Wikelist(request) {
		const res = await http(request);
		const data = res.data;
		if (data.code == "200") {
			let _entities = data.data.entities
			_entities.forEach(function (item) {
				item.checkBOx = false;
			});
			this.setState({
				data: _entities
			})
			console.log('this.state.data', this.state.data)
			
			return this.state.data;
		}
		throw data.msg;
	}
	// 判断当前状态是否为筛选，不为筛选则点击列表跳转页面到详情
	CheckBoxShow(item) {
		if (this.state.animating) {
			return (
				this.checked(item)
			)

		} else {
			return (
				() => this.props.navigation.navigate("WitkeyDetail", item)
			)
		}
	}

	// 选中反选
	checked( item ) {
		console.log(item)
		let items = this.state.data
		// items.map((value, i) => {
		// 	if (item.id == value.id) {
		// 		value.checkBOx = !item.checkBOx
		// 		this.setState({
		// 			data: items
		// 		})
		// 	}
		// })
		item.checkBOx = true;
		console.log('this', items);
	}

}



const styles = StyleSheet.create({
	main: {
		backgroundColor: '#fff'
	},
	mainLIst: {
		// width: '100%'
	},
	mainText: {
		// flex: 1,
		// flexDirection: "column",
	},
	mainText1: {
	},
	mainText2: {
		// flex: 1,
		// flexDirection: "row",
		width: '100%'
	},
	leftImg: {
		width: transformSize(250),
		height: transformSize(250),
		borderRadius: transformSize(20),
		alignSelf: "flex-start"
	},
	content: {
		marginLeft: transformSize(34)
	},
	title: {
		marginBottom: transformSize(53),
		color: "#29B953"
	},
	siteWrapper: {
		flexDirection: "row",
		alignItems: "center"
	},
	site: {
		fontSize: transformSize(40),
		color: "#999999",
		paddingLeft: transformSize(16)
	},
	contentItem: {
		fontSize: transformSize(46),
		color: "#333333",
		marginBottom: transformSize(35)
	},
	arrowBack: {
		fontSize: transformSize(51),
		color: '#000',
		textAlign: 'left',
		marginLeft: -4,

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