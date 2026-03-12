import pdf from 'pdf-parse'

export async function extractText(
  content?: string,
  fileBase64?: string,
  googleDocUrl?: string
): Promise<string> {
  // Direct text input
  if (content && content.trim().length > 0) {
    return content.trim()
  }

  // PDF file
  if (fileBase64) {
    const buffer = Buffer.from(fileBase64, 'base64')
    const data = await pdf(buffer)
    return data.text.trim()
  }

  // Google Doc (public link)
  if (googleDocUrl) {
    const docId = extractGoogleDocId(googleDocUrl)
    if (!docId) {
      throw new Error('Invalid Google Doc URL. Expected format: https://docs.google.com/document/d/{id}/...')
    }

    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`
    const res = await fetch(exportUrl)

    if (!res.ok) {
      throw new Error('Could not fetch Google Doc. Make sure it is publicly accessible (Anyone with the link).')
    }

    const text = await res.text()
    return text.trim()
  }

  throw new Error('No content provided. Send either content, file, or googleDocUrl.')
}

function extractGoogleDocId(url: string): string | null {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}
