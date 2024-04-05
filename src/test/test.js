function testList() {
    let urls = '1,2,3'
    const list = urls.split(',').map(value => {
        return {url: value}
    })
    console.log(JSON.stringify(list))
}

testList()