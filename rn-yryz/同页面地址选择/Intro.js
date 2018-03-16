import React from 'react';
import { StyleSheet, TextInput, Alert, NativeModules } from 'react-native';
import {
	Content, Container, Right, Button, Text, Card, ListItem, View, Touchable, Left, Body, Title, Nav, List, Thumbnail, Form, Input, Textarea, Label, Picker, Item, Radio, ActionSheet, H3, Root, Image, withUser, withNavigation
} from '../../components';
import { YIcon } from '../../assets';
import { transformSize, textPrimaryColor } from '../../styles';
import { http } from "../../services";
import { ImagePicker } from '#expo';
import { connect } from 'react-redux';
let mapStateToProps = (state) => {
	return {
		userdata: state.intro,
		city: state.city
	};
};

let jsonData = require('./components/area.json');
let moheadImg = require('../../assets/images/default-avatar.png');

let FirstData = [
	'男',
	'女',
];
var BUTTONS = ["拍照", "选择相册", "取消"];

@withUser(true)
@connect(mapStateToProps)
@withNavigation
export default class Intro extends React.Component {
	headerRight() {
		return (
			<Touchable onPress={this.Submit.bind(this)}>
				<Text style={styles.haderTitle}>保存</Text>
			</Touchable>

		);
	}


	// 定义默认属性
	static defaultProps = {
		// 默认显示北京(省)
		selectedProvince: '',
		// 默认显示北京省会市)
		selectedCity: '',
		// 默认显示(区)
		selectedArea: ''
	}

	// 通过 state 更新
	constructor(props) {
		super(props);

		this.state = {
			headImg: null,
			sex: '',
			addr: '',
			userSign: '',
			nickName: '',
			firstValue: FirstData[0],
			// 省
			province: [],
			// 市
			city: [],
			// 区
			area: [],
			// 选中的省
			selectedProvince: this.props.selectedProvince,
			// 选中的市
			selectedCity: this.props.selectedCity,
			// 选中的地区
			selectedArea: this.props.selectedArea,

			cityPicker: false,

			selectedsex: this.props.selectedsex,
			maxText: 0,
			_cityShow: false,
			cityShow: false,
			sexShow: false
		};
	}

	// 获取用户信息
	async useSummary() {
		const userRes = await http.get(`/services/app/v1/user/single/local/${this.props.user.custId}`);
		const userData = userRes.data;
		if (userData.code == '200') {
			this.props.dispatch({ type: 'LOAD_INTRO', payload: userData.data });
			if (!userData.data) {
				Alert.alert('接口返回无数据');
				return;
			}
			let _addr = userData.data.addr.split(' ');


			this.setState({
				headImg: userData.data.headImg,  // 用户头像 headImg
				nickName: userData.data.nickName, // 用户昵称
				sex: userData.data.sex == '0' ? '女' : '男',	//   性别
				addr: userData.data.addr,        //  地址
				selectedProvince: _addr[0],
				selectedCity: _addr[1],
				selectedArea: _addr[2],
				userSign: userData.data.userSign,  // 个人签名
			});
			this.props.dispatch({ type: 'LOAD_CITY', payload: _addr });

		} else {
			alert(userData.msg);
		}

	}

	// 编辑用户信息
	Submit = async () => {
		let parmes = {
			userId: this.props.user.custId,
			headImg: this.state.headImg,
			sex: this.state.sex == '女' ? '0' : '1',
			addr: this.state.selectedProvince + ' ' + this.state.selectedCity + ' ' + this.state.selectedArea,
			userSign: this.state.userSign,
			nickName: this.state.nickName,
		};
		let res = await http.post('/services/app/v1/user/cust/editor/local', parmes);
		let resData = res.data;
		if (resData.code == '200') {
			Alert.alert('保存成功！');
			this.props.dispatch({ type: 'LOAD_INTRO', payload: parmes });
		} else {
			// alert(resData.msg)

		}

	}

	// ——————————————————————————————性别选择————————————————————————————————

	sexList() {
		return (
			<List>
				{FirstData.map((key, i) => this.renderSex(key, i))}
			</List>
		);

	}
	renderSex(key, i) {
		return (
			<ListItem style={styles.List} key={i} onPress={this.SexClick.bind(this, key)}>
				<Text value={key}>{key}</Text>
				{this.state.sex === key ? <Right style={styles.Radio}>
					<Radio selected={true} />
				</Right> : null}
			</ListItem>
		);

	}
	SexClick(value) {
		this.setState({
			sex: value,
			sexShow: false,
			_cityShow: false,
		});
	}

	_sexClick() {
		this.setState({
			_cityShow: true,
			sexShow: true,

		});
	}
	// ——————————————————————————————性别选择结束—————————————————————————————


	// 获取全国省: ['省1', '省2', '省3'......]
	getProvince() {
		var result = [];
		for (var code in jsonData) {
			result.push(jsonData[code].name);
		}
		return result;
	}

	// 获取各个省的城市[['省1-城市1', '省1-城市2', '省1-城市3'......],['省2-城市1', '省2-城市2', '省2-城市3'......]]
	getProvinceCity(province) {
		var result = [];
		var cityData = [];
		for (var code in jsonData) {
			let temp = jsonData[code].name;
			if (temp == province) {
				cityData = jsonData[code].city;
				for (var j in cityData) {
					result.push(cityData[j].name);
				}
				break;
			}
		}

		return result;
	}

	// 获取各个省的城市[['省1-城市1-区1', '省1-城市1-区2', '省1-城市1-区3'......]......]
	getProvinceCityArea(province, city) {
		var result = [];
		var cityData = [];
		for (var code in jsonData) {
			let tempProvince = jsonData[code].name;
			if (tempProvince == province) {
				cityData = jsonData[code].city;
				for (var j in cityData) {
					let tempCity = cityData[j].name;
					// console.log('查询省: ' + tempProvince + '    查询城市: ' + city)
					if (tempCity == city) {
						result = cityData[j].area;
						// console.log('查询区: ' + result)
						break;
					}
				}
			}
		}

		return result;
	}


	componentDidMount() {

		this.useSummary();


		var province = this.getProvince();
		// this.state.selectedProvince = province[0];

		var city = this.getProvinceCity(this.state.selectedProvince);
		// this.state.selectedCity = city[0];

		var area = this.getProvinceCityArea(this.state.selectedProvince, this.state.selectedCity);
		// this.state.selectedArea = area[0];

		// 初始化城市复制
		this.setState({
			province: province,
			city: city,
			area: area
		});

		console.log('\n******省: ' + province + '\n******默认省: ' + this.state.selectedProvince);
		console.log('\n******城市: ' + city + '\n******默认城市: ' + this.state.selectedCity);
		console.log('\n******区: ' + area + '\n******默认区: ' + this.state.selectedArea);
	}

	// 这里动态计算富文本框输入字数
	onChange(value) {
		this.setState({
			maxText: value.length,
			userSign: value
		});
	}

	// 控制城市以及性别选择
	_cityClick() {
		// this.setState({
		// 	_cityShow: true
		// });
		this.props.navigation.navigate('City')
	}

	// 省级选择，【Radio 的selected表现选中状态，这里通过点击存入数据和当前本身数据匹配完成，点击的存入在onClick方法】
	renderProvince(key, i) {
		return (
			<ListItem style={styles.List} key={i} onPress={this.onClick.bind(this, key)}>
				<Text value={key}>{key}</Text>
				{this.state.selectedProvince === key ? <Right style={styles.Radio}>
					<Radio selected={true} />
				</Right> : null}
			</ListItem>
		);

	}
	//  市级选择
	renderCity(key, i) {
		return (
			<ListItem style={styles.List} key={i} onPress={this.updateProvinceCity.bind(this, key)}>
				<Text>{key}</Text>
				{this.state.selectedCity === key ? <Right>
					<Radio selected={true} />
				</Right> : null}
			</ListItem>
		);

	}

	// 地区选择
	renderArea(key, i) {
		return (
			<ListItem style={styles.List} key={i} onPress={this.updateProvinceCityArea.bind(this, key)}>
				<Text>{key}</Text>
				{this.state.selectedArea === key ? <Right>
					<Radio selected={true} />
				</Right> : null}
			</ListItem>
		);

	}

	// 存省
	onClick(value) {
		this.setState({
			city: this.getProvinceCity(value),
			selectedProvince: value,
			cityShow: true
		});

	}

	// 存市
	updateProvinceCity(value) {
		this.setState({
			area: this.getProvinceCityArea(this.state.selectedProvince, value),
			selectedCity: value,
			cityShow: false,
			areaShow: true
		});

	}

	// 存区
	updateProvinceCityArea(value) {
		this.setState({
			area: this.getProvinceCityArea(this.state.selectedProvince, value),
			selectedArea: value,
			cityShow: false,
			areaShow: false,
			_cityShow: false
		});

		// this.props.navigation.goBack();
	}

	// 当切换到性别和地区选择列表是重新定义返回，这里是因为我在一个页面实现了地区和性别的选择，为了避免页面跳转数据存储，原本是采用的原生【Picker】
	// 因为ios和Android自身样式差别太大而放弃。然后通过跳转页面列表式去选择，但是跳转路由之后，我发现数据的存储很麻烦，于是通过显示隐藏的方式在同一个页面来实现，这样也导致了点击的切换很生硬。但是功能实现了，后面有时间慢慢摸索优化。
	_renderLeft() {
		this.setState({
			sexShow: false,
			_cityShow: false,
			cityShow: false,
			areaShow: false,
			selectedProvince: '湖北',
			selectedCity: '武汉',
			selectedArea: '洪山区'
		});
		return false;
	}



	mainlist() {
		if (!this.state.cityShow && !this.state.areaShow) {
			return (
				<List>
					{this.state.province.map((key, i) => this.renderProvince(key, i))}
				</List>
			);
		} else if (this.state.cityShow) {
			return (
				<List>
					{this.state.city.map((key, i) => this.renderCity(key, i))}
				</List>
			);

		} else if (this.state.areaShow) {
			return (
				<List>
					{this.state.area.map((key, i) => this.renderArea(key, i))}
				</List>
			);
		}


	}

	cityMain() {
		if (this.state.sexShow) {
			return (
				<Container>
					<Nav handleBack={this._renderLeft.bind(this)} title='性别'></Nav>
					<Content>
						{this.sexList()}
					</Content>
				</Container>
			);

		} else {
			return (
				<Container>
					<Nav handleBack={this._renderLeft.bind(this)} title='所在城市'></Nav>
					<Content>
						{this.mainlist()}
					</Content>
				</Container>
			);
		}

	}

	NickonEndEditing(value) {
		this.setState({
			nickName: value
		});
	}

	// 上传头像
	sheet() {
		ActionSheet.show({
			title: '请选择',
			options: BUTTONS,
			cancelButtonIndex: 2,
		}, async (index) => {
			if (BUTTONS[index] === '拍照') {
				let result = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					base64: true,
					aspect: [4, 4],
				});
				// console.log(result.base64);
				if (!result.cancelled) {
					this.setState({ headImg: result.uri });
					// console.log(this.state.headImg);
				}

			}
			if (BUTTONS[index] === '选择相册') {
				let result = await ImagePicker.launchImageLibraryAsync({
					allowsEditing: true,
					base64: true,
					aspect: [4, 4],
				});
				// console.log(result.base64);
				if (!result.cancelled) {
					// oss图片转换
					// NativeModules.YCommon.requestOSS([result.uri]).then((res) => {


					// });
					// alert(this.state.headImg);
					this.setState({ headImg: result.uri });
				}
			}
		});
	}

	render() {
		let { headImg } = this.state;
		console.log(this.state.headImg == null);
		if (this.state._cityShow) {
			return this.cityMain();
		} else {

			return (
				<Container style={styles.mainCont} >
					<Nav title='个人信息' rightComponent={this.headerRight()}></Nav>

					<Content>
						<List>
							<ListItem style={styles.mainone} onPress={() => this.sheet()}>
								<Text>头像</Text>

								<View style={styles.mainRight}>
									<Thumbnail
										onPress={() => this.sheet()}
										size={250}
										source={this.state.headImg ? { uri: this.state.headImg } : moheadImg}
										style={styles.leftImg} />
									<YIcon name="arrow-right" style={styles.arrowRight} />

								</View>
							</ListItem>

							<ListItem style={styles.mainListNIck}>
								<Text>昵称</Text>
								<View style={styles.mainRight}>
									<Form>
										<Input onChangeText={this.NickonEndEditing.bind(this)} autoCorrect maxLength={10} style={styles.mainNickInput} placeholder="请输入昵称" value={this.state.nickName} />
									</Form>
									<YIcon name="arrow-right" style={styles.arrowRight} />
								</View>
							</ListItem>

							<ListItem style={styles.mainList} onPress={this._sexClick.bind(this)}>
								<Text>性别</Text>
								<View style={styles.mainRight}>
									<Text>{this.state.sex}</Text>
									<YIcon name="arrow-right" style={styles.arrowRight} />
								</View>
							</ListItem>

							<ListItem style={styles.mainList} onPress={this._cityClick.bind(this)}>
								<Text>地区</Text>
								<View style={styles.mainRight}>
									{/* <Text>{this.state.selectedProvince}  </Text>
									<Text>{this.state.selectedCity.substring(0, 5)}  </Text>
									<Text>{this.state.selectedArea.substring(0, 6)}  </Text> */}

									<Text>{this.props.city[0]}  </Text>
									<Text>{this.props.city[1].substring(0, 5)}  </Text>
									<Text>{this.props.city[2].substring(0, 6)}  </Text>
									<YIcon name="arrow-right" style={styles.arrowRight} />
								</View>
							</ListItem>

							<ListItem style={styles.mainEnd}>
								<Text style={styles.mainEndTitle}>个人简介</Text>
								<Textarea maxLength={30} onChangeText={this.onChange.bind(this)} style={styles.mainEndInput} placeholder="还没有任何个人介绍" value={this.state.userSign}> </Textarea>
								<View style={styles.mainEndRight}>
									<Text note>
										<Text>{this.state.maxText || this.state.userSign.length}</Text>
										/30
									</Text>
								</View>
							</ListItem>

						</List>
					</Content>


				</Container>

			);


		}

	}
}
const styles = StyleSheet.create({
	haderTitle: {
		color: "#ff6f6b",
		paddingRight: transformSize(44)

	},

	List: {
		width: '100%',
		marginLeft: 0,
		marginRight: 0,
		paddingLeft: transformSize(44),
		paddingRight: transformSize(44),
		justifyContent: 'space-between'
	},
	mainCont: {
		backgroundColor: '#F8F8F8'
	},
	mainone: {
		flex: 1,
		justifyContent: 'space-between',
		marginLeft: 0,
		marginRight: 0,
		paddingLeft: transformSize(44),
		paddingTop: transformSize(65),
		paddingBottom: transformSize(62),
		paddingRight: transformSize(44),
	},
	mainList: {
		flex: 1,
		justifyContent: 'space-between',
		marginLeft: 0,
		marginRight: 0,
		paddingTop: transformSize(65),
		paddingBottom: transformSize(60),
		paddingLeft: transformSize(44),
		paddingRight: transformSize(44),
	},
	mainListNIck: {
		flex: 1,
		justifyContent: 'space-between',
		marginLeft: 0,
		marginRight: 0,
		marginBottom: transformSize(35),
		paddingTop: transformSize(15),
		paddingBottom: transformSize(15),
		paddingLeft: transformSize(44),
		paddingRight: transformSize(44),
	},
	mainNickInput: {
		width: transformSize(600),
		textAlign: 'right',
		flexDirection: 'row-reverse',
		margin: 0,
		padding: 0,
	},
	mainEnd: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginLeft: 0,
		marginRight: 0,
		paddingLeft: transformSize(44),
		paddingTop: transformSize(65),
		paddingBottom: transformSize(60),
		marginTop: transformSize(35),
		paddingRight: transformSize(44),
	},
	mainEndTitle: {
		width: '100%',
	},
	mainEndInput: {
		width: '100%',
		padding: 0,
		paddingLeft: transformSize(-100)
	},
	mainEndRight: {
		flex: 3,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'flex-end'
	},
	mainRight: {
		flex: 2,
		// width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	leftImg: {
		marginRight: transformSize(30)
	},
});