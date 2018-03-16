import React from 'react';
import { StyleSheet } from 'react-native';
import {
	Content, Container, Right, Button, Text, Card, ListItem, View, Touchable, Left, Body, Title, Nav, List, Thumbnail, withNavigation
} from '../../../components';
import { YIcon } from '../../../assets';
import { transformSize, textPrimaryColor } from '../../../styles';
import { http } from '../../../services';
@withNavigation
export default class Message extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			noticeData: [],
			adData: [],
		};
	}

	componentDidMount() {
		let adData = [
			{
				icon: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2555648103,1321676663&fm=27&gp=0.jpg',
				title: '傣妹国民火锅',
				content: '傣妹餐饮VIP会员卡',
				createDate: '2017-10-09'
			},
			{
				icon: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2555648103,1321676663&fm=27&gp=0.jpg',
				title: 'Balabala武汉',
				content: '已经有500个用户关注了该应用',
				createDate: '2017-10-09'
			},
			{
				icon: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2555648103,1321676663&fm=27&gp=0.jpg',
				title: '美味不用等',
				content: '美味不用等美味不用等美味不用等美味不用等美味不用等美味不用等美味不用等美味不用等美味不用等美味不用等',
				createDate: '2017-10-09'
			},
			{
				icon: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2555648103,1321676663&fm=27&gp=0.jpg',
				title: '麦当劳',
				content: '麦当劳麦当劳麦当劳麦当劳麦当劳麦当劳',
				createDate: '2017-10-02'
			},
			{
				icon: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2555648103,1321676663&fm=27&gp=0.jpg',
				title: '皮卡皮卡丘',
				content: '皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘皮卡皮卡丘',
				createDate: '2017-10-01'
			}
		];
		this.setState({
			adData: adData
		});
		this.getMessageData();
	};

	async getMessageData() {
		const res = await http.get(`/services/app/v1/notice/getLateNotice`);
		const MessageData = res.data;
		if (MessageData.code == '200') {
			this.setState({ noticeData: MessageData.data });
		} else {
			alert(MessageData.msg);
		}
	}

	renderItem(item, index) {
		return (
			<ListItem style={styles.mainList} avatar key={index}>
				<Thumbnail style={styles.mainInage} square source={{ uri: item.icon }} />
				<Body style={styles.mainBody}>
					<View style={styles.listTitle}>
						<Text>{item.title}</Text>
						<Text>{item.createDate}</Text>
					</View>
					<Text numberOfLines={1}>{item.content}</Text>
				</Body>
			</ListItem>
		);
	}

	render() {
		return (
			<Container style={styles.contMain}>
				<Nav title='我的消息'></Nav>
				<Content>
					<List>
						<ListItem style={styles.mainList} avatar onPress={() => this.props.navigation.navigate("Notice")}>
							<Left>
								<Thumbnail style={styles.mainInage} square source={require('../../../assets/images/icon-notice.png')} />
								<View style={styles.newDot}></View>
							</Left>
							<Body style={styles.mainBody}>
								<View style={styles.listTitle}>
									<Text>{this.state.noticeData.title}</Text>
									<Text>{this.state.noticeData.createDate}</Text>
								</View>
								<Text numberOfLines={1}>{this.state.noticeData.content}</Text>
							</Body>
						</ListItem>
						{this.state.adData.map(this.renderItem)}
					</List>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	contMain: {
		backgroundColor: '#FFF',
	},
	mainList: {
		paddingTop: transformSize(30),
		paddingBottom: transformSize(30),
		borderBottomWidth: 1,
	},
	mainInage: {
		borderRadius: transformSize(25)
	},

	mainBody: {
		borderBottomWidth: 0
	},
	newDot: {
		position: 'absolute',
		top: 0,
		right: -5,
		width: transformSize(40),
		height: transformSize(40),
		borderWidth: transformSize(5),
		borderColor: "#fff",
		borderRadius: transformSize(20),
		backgroundColor: '#F00',
		// elevation: 20,
		// marginLeft: -10,
		// paddingLeft: 10,
		// shadowOffset: { width: 2, height: 0 },
		// shadowColor: '#fff',
		// shadowOpacity: 5,
		// shadowRadius: 5
	},
	listTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	}
});