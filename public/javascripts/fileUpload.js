const rootStyle = window.getComputedStyle (document.documentElement)

if (rootStyle.getPropertyValue('--book-cover-width-large') != null) {
    read()
} else {
    document
        .getElementById('main-css')
        .addEventListener('load', read())
}

function read() {
    const coverWidth = parseFloat(rootStyle.getPropertyValue('--book-cover-width-large'))
    const coverRatio = parseFloat(1 / rootStyle.getPropertyValue('--book-cover-aspect-ratio'))
    const coverHeight = coverWidth / coverRatio

    FilePond.registerPlugin (
        FilePondPluginFileEncode,
        FilePondPluginImagePreview,
        FilePondPluginImageResize
    )

    FilePond.setOptions ({
        stylePanelAspectRatio:coverRatio,
        imageResizeTargetWidth:coverWidth,
        imageResizeTargetHeight:coverHeight
    })

    FilePond.parse(document.body)
}

