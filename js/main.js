'use strict';

const tree = {
    id: 1,
    parentId: null,
    isChecked: false,
    text: 'Home',
    children: [
        {
            id: 2,
            parentId: 1,
            isChecked: false,
            text: 'First Child',
            children: [
                {
                    id: 3,
                    parentId: 2,
                    isChecked: false,
                    text: 'Child in child #1',
                    children: [
                        {
                            id: 5,
                            parentId: 3,
                            isChecked: false,
                            text: 'Grandchild #1',
                            children: []
                        },
                        {
                            id: 6,
                            parentId: 3,
                            isChecked: false,
                            text: 'Grandchild #2',
                            children: []
                        },
                    ]
                },
                {
                    id: 10,
                    parentId: 2,
                    isChecked: false,
                    text: 'Child in child #2',
                    children: []
                },
            ]
        },
        {
            id: 4,
            parentId: 1,
            isChecked: false,
            text: 'Second Child',
            children: []
        }
    ]
}
const elTreeList = document.querySelector('.tree-list')

renderTree(tree)

function renderTree(tree) {
    renderTreeRoot(tree)
    renderChildren(tree)
}

function renderTreeRoot(tree) {
    const rootStrHTML = `
    <div>
        <input type="checkbox" id="root" ${tree.isChecked && 'checked'} oninput="onCheckboxClick(${tree.id})" >
        <label for="root">${tree.text}</label>
    </div>
    `
    elTreeList.innerHTML = rootStrHTML
}

function renderChildren(node, spaces = 2) {
    if (!node.children.length) return
    let spacesHTML
    if (spaces) {
        spacesHTML = '&nbsp;'.repeat(spaces)
    }
    let strHTML = ''
    node.children.forEach(child => {
        strHTML += `
        <div>
        ${spacesHTML ? spacesHTML : ''}
            <input type="checkbox" id=${child.id} ${child.isChecked && 'checked'} oninput="onCheckboxClick(${child.id})"  >
            <label for=${child.id}>${child.text}</label>
        </div>
        `
        elTreeList.innerHTML += strHTML
        strHTML = ''
        if (child.children.length) {
            renderChildren(child, spaces += 4)
        }
    })
    elTreeList.innerHTML += strHTML

}


// On click, update the checkbox state.
// If checkbox has children, change their state according to parent.
// If checkbox has parents, check their children to see if the parent state should change.
function onCheckboxClick(id) {
    const nodeClicked = findNodeById(id, tree)
    const nodeStatus = !nodeClicked.isChecked
    nodeClicked.isChecked = nodeStatus
    if (nodeClicked.children.length) {
        updateChildren(nodeClicked, nodeStatus)
    }
    if (nodeClicked.parentId) {
        checkParent(nodeClicked)
    }
    renderTree(tree)
}

function findNodeById(id, node = tree) {
    if (node.id === id) {
        return node
    }
    if (node.children.length) {
        for (let child of node.children) {
            if (child.id === id) {
                return child
            }
            if (child.children.length) {
                const resultNode = findNodeById(id, child)
                if (resultNode) return resultNode
            }
        }
    }
}

function updateChildren(node, status) {
    node.children.forEach(child => {
        child.isChecked = status
        if (child.children.length) {
            updateChildren(child, status)
        }
    })
}

function checkParent(node) {
    const parentNode = findNodeById(node.parentId)
    const parentNumOfChildren = parentNode.children.length
    let childrenCheckedTrue = 0
    for (let child of parentNode.children) {
        if (child.isChecked) {
            childrenCheckedTrue++
        }
    }
    if (childrenCheckedTrue === parentNumOfChildren) {
        parentNode.isChecked = true
    } else {
        parentNode.isChecked = false
    }
    if (parentNode.parentId) {
        checkParent(parentNode)
    }
}
