
type PdfUploaderProps = {
    setInput: (text: string) => void
    uploading: boolean
    setUploading: (status: boolean) => void
    loading: boolean
  }
  
  // pdf uploading function 
  export default function PdfUploader({ setInput, uploading, setUploading, loading }: PdfUploaderProps) {
    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return
  
      setUploading(true)
      const file = e.target.files[0]
  
      const formData = new FormData()
      formData.append('file', file)
  
      const pdfRes = await fetch('/api/pdf', {
        method: 'POST',
        body: formData,
      })
  
      const { text } = await pdfRes.json()
      setInput(text)
      setUploading(false)
    }
  
    return (
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex flex-col sm:flex-row items-center gap-2">
        <label className="text-sm font-medium text-gray-300">Upload PDF:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          disabled={uploading || loading}
          className="flex-1 text-sm text-gray-100 file:bg-gray-700 file:text-gray-100 file:border-0 file:px-4 file:py-2 file:rounded-lg"
        />
        {uploading && (
          <p className="text-sm text-gray-400 animate-pulse">
            Extracting text from PDF...
          </p>
        )}
      </div>
    )
  }
  