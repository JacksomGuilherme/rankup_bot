const fs = require('fs')

module.exports = {
    loadApprovals() {
        return JSON.parse(fs.readFileSync('./public/approvals.json'))
    },
    
    saveApprovals(data) {
        fs.writeFileSync('./public/approvals.json', JSON.stringify(data, null, 2))
    }
}
