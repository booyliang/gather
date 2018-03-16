import React from 'react';
import { StyleSheet, TouchableHighlight, Alert } from 'react-native';
import {
	Content, Container, Right, Button, Text, Card, ListItem, View, Touchable, Left, Body,
	Title, Nav, List, Thumbnail, CheckBox, TagGroup, Tag, SwipeRow, Icon, YIcon, FlowList,
	withNavigation, Header, withUser
} from '../../../components';
import { transformSize, textPrimaryColor } from '../../../styles';
import { http } from '../../../services'
@withNavigation
@withUser(true)
export default class Attention extends React.Component {
	mockData = [
		{
			id: 1,
			appliIcon: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2555648103,1321676663&fm=27&gp=0.jpg',
			appliName: '最多八个字最对八个字',
			attentionCount: 1200,
			labels: [{
				id: 1,
				label_name: '王者'
			}],
			solon: '最多二十个字最多二十个字',
			checkBOx: false,
		},
		{
			id: 2,
			appliIcon: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2555648103,1321676663&fm=27&gp=0.jpg',
			appliName: '最多八个字最对八个字',
			attentionCount: 1200,
			labels: [{
				id: 1,
				label_name: '王者'
			}],
			solon: '最多二十个字最多二十个字',
			checkBOx: false,
		}


	]
	ItemId = [];
	constructor(props) {
		super(props);
		this.state = {
			animating: false,
			check: false,
			showText: "编辑",
			data: [],
			id: '',
			FlagData: []
		};
	}
	componentDidMount() {
		this.setState({
			data: this.mockData
		})

	};
	headerRight() {
		return (
			<Text onPress={this.editClick.bind(this)} style={{ color: "#caa00d" }}>{this.state.showText}</Text>
		);
	};
	editClick() {
		if (this.state.animating) {
			let _FlagData = []
			this.state.data.map((item) => {
				if (item.checkBOx) {
					_FlagData.push(item.id);
				}

			})
			let _FlagIndex = _FlagData.length;
			if (_FlagIndex == 0) {
				Alert.alert(
					null,
					'请选择要删除的关注！',
					[
						{ text: '确定', onPress: () => console.log('OK Pressed') },
					],
					{ cancelable: false }
				);
				return;
			}
			FlagText = '确定删除' + _FlagIndex + '个关注？',
				Alert.alert(
					null,
					FlagText,
					[
						{ text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
						{
							text: '确定', onPress: async () => {
								let res = await http.get(`/serivces/app/v1/attention/followApps/${_FlagData}/0`)
							}
						},
					],
					{ cancelable: false }
				);
			return;
		} else {
			this.setState({
				animating: true,
				showText: '删除'
			});

		}

	}
	checked({ item }) {
		this.ItemId.push(item.id);
		let items = this.state.data;
		items.map((value, i) => {
			if (item.id == value.id) {
				value.checkBOx = !item.checkBOx
				this.setState({
					data: items
				})
				// let ids = this.state.FlagData
			}
		})
		console.log(this.state.data);
	}

	// 判断数组总是否有某个值
	isInArray(arr, value) {
		for (var i = 0; i < arr.length; i++) {
			if (value === arr[i]) {
				return true;
			}
		}
		return false;
	}



	CheckBoxShow(item) {
		alert(1)
		console.log('item', item)
		if (this.state.animating) {
			return (
				this.checked.bind(this, { item })
			)

		} else {
			return (
				() => this.props.navigation.navigate("User")
			)
		}
	}

	// 头部导航自定义
	_handleBack = () => {
		if (this.state.animating) {
			this.setState({
				animating: false
			})
		} else {
			this.props.navigation.goBack();
		}
	};

	AttentionLeft = () => {
		let leftContent = this.state.animating ? <Text>取消</Text> : <YIcon name="arrow-back" style={styles.arrowBack} />;
		return (
			<Left>
				<Button transparent onPress={this._handleBack} dark>
					{leftContent}
				</Button>
			</Left>
		);
	}

	AttentionRight = () => {
		return (
			<Right>
				<Button transparent dark>
					<Text onPress={this.editClick.bind(this)} style={{ color: "#caa00d" }}>{this.state.showText}</Text>
				</Button>
			</Right>
		)
	}
	renderItem = ({ item }) => {
		return (
			<ListItem style={styles.mainLIst} onPress={this.CheckBoxShow(item)} key={item.id}>
				{
					this.state.animating ? <CheckBox onPress={this.checked.bind(this, item)}
						style={item.checkBOx ? styles.mainCheck : styles.oldCheck} checked={item.checkBOx} /> : null
				}
				<View style={styles.LIst}>

					<View>
						<Thumbnail square large source={{ uri: item.appliIcon }} style={styles.leftImg} />
					</View>

					<View style={styles.mainRight}>
						<Text style={[styles.mainRightItem, styles.mainRightItemTit]} numberOfLines={1} ellipsizeMode='tail'>{item.appliName}</Text>
						<Text style={styles.mainRightItem}>{item.solon}</Text>
						<TagGroup style={styles.mainRightTag}>

						</TagGroup>
						<View style={styles.mainrTextRight}>
							<YIcon name="gift" style={{ fontSize: transformSize(40), height: '100%' }}>游戏 </YIcon>
							<Text>{item.downloadCount}人关注</Text>
						</View>
					</View>
				</View>
			</ListItem>

		)
	}


	render() {
		// let renderItem = [];
		// this.state.data.map((item, index) => {
		// 	// 这里做测试的关注取消关注，当点击的id等于当前数据id时将该数据id传给关注的后台
		// 	let list = (
		// 		<ListItem style={styles.mainLIst} onPress={this.CheckBoxShow(item, index)} key={index}>
		// 			{
		// 				this.state.animating ? <CheckBox onPress={this.checked.bind(this, { item, index })}
		// 					style={item.checkBOx ? styles.mainCheck : styles.oldCheck} checked={item.checkBOx} /> : null
		// 			}
		// 			<View style={styles.LIst}>

		// 				<View>
		// 					<Thumbnail square large source={{ uri: item.appliIcon }} style={styles.leftImg} />
		// 				</View>

		// 				<View style={styles.mainRight}>
		// 					<Text style={[styles.mainRightItem, styles.mainRightItemTit]} numberOfLines={1} ellipsizeMode='tail'>{item.appliName}</Text>
		// 					<Text style={styles.mainRightItem}>{item.solon}</Text>
		// 					<TagGroup style={styles.mainRightTag}>
		// 						{item.labels.map((tag) => <Tag key={tag.id}>{tag.label_name}</Tag>)}
		// 					</TagGroup>
		// 					<View style={styles.mainrTextRight}>
		// 						<YIcon name="gift" style={{ fontSize: transformSize(40), height: '100%' }}>游戏 </YIcon>
		// 						<Text>{item.attentionCount}人关注</Text>
		// 					</View>
		// 				</View>
		// 			</View>
		// 		</ListItem>
		// 	)
		// 	renderItem.push(list);

		// })


		return (
			<Container style={styles.contMain}>
				{/* <Nav renderLeft='取消' title='应用关注' rightComponent={this.headerRight()}></Nav> */}
				<Header>
					{this.AttentionLeft()}
					<Body>
						<Title>应用关注</Title>
					</Body>
					{this.AttentionRight()}
				</Header>
				<Content>
					<List style={styles.mains}>

						<FlowList renderItem={this.renderItem} request='/services/app/v1/attention/app'></FlowList>
					</List>

				</Content>

			</Container >
		);
	}
}

const styles = StyleSheet.create({
	mains: {
		// backgroundColor: "#fff"
	},
	mainLIst: {
		marginLeft: 0,
		marginRight: 0,
		paddingRight: transformSize(44),
		paddingLeft: transformSize(44)

	},
	LIst: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	mainRight: {
		width: '100%',
		flex: 1
	},
	leftImg: {
		width: transformSize(200),
		height: transformSize(200),
		borderRadius: transformSize(20),
		marginRight: transformSize(75),
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
	mainRightItem: {
		fontSize: transformSize(46),
		marginBottom: transformSize(35)

	},
	mainRightItemTit: {
		fontSize: transformSize(56),
		fontWeight: 'bold'

	},
	mainRightTag: {
		marginBottom: transformSize(35)

	},
	mainrTextRight: {
		flexDirection: "row",
		justifyContent: 'space-between',
	},
	arrowBack: {
		fontSize: transformSize(51),
		color: '#000',
		textAlign: 'left',
		marginLeft: -4,

	},
});