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

testSplit()