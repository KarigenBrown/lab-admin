const {pinyin} = require('pinyin-pro');

function testList() {
    let urls = '1,2,3'
    const list = urls.split(',').map(value => {
        return {url: value}
    })
    console.log(JSON.stringify(list))
}

function testPlusPlus() {
    let text = '1'
    text++
    console.log(text)
}

function testSplit() {
    let text = ''
    text = text.split(',')
    console.log(JSON.stringify(text))
}

function testSome() {
    let permitList = ['权限管理', '成果管理', '人员管理', 'Demo管理', '活动管理']
    let permits = ['成果管理']
    let include = permitList.some(permit => permits.includes(permit))
    console.log('include: ' + include)
}

function testInitials(journal) {
    let initials = journal
    if (/[\u4e00-\u9fff]/.test(journal)) {
        initials = pinyin(journal, {toneType: 'none', type: 'array'}).join(' ');
    }

    initials = initials.split(' ')
        .map(word => word.charAt(0).toLowerCase())
        .join('');

    console.log(initials)
}

testInitials('中文会议')
testInitials('Security and Communication Networks')