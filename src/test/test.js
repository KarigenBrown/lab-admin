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

testSome()