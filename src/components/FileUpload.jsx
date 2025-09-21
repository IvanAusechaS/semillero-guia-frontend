import { useState, useRef } from 'react'
import { Upload, X, File, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Componente FileUpload para entregas de asignaciones
 * Máximo 5 archivos, 10MB cada uno
 * Compatible con el backend Multer
 */
const FileUpload = ({ 
  files = [], 
  onChange, 
  disabled = false,
  maxFiles = 5,
  maxSizePerFile = 10 * 1024 * 1024, // 10MB
  acceptedTypes = '',
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState([])
  const inputRef = useRef(null)

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Validar archivos
  const validateFiles = (fileList) => {
    const newErrors = []
    const validFiles = []

    // Verificar límite de archivos
    if (files.length + fileList.length > maxFiles) {
      newErrors.push(`Máximo ${maxFiles} archivos permitidos`)
      return { validFiles: [], errors: newErrors }
    }

    Array.from(fileList).forEach((file, index) => {
      // Verificar tamaño
      if (file.size > maxSizePerFile) {
        newErrors.push(`${file.name}: Tamaño máximo ${formatFileSize(maxSizePerFile)}`)
        return
      }

      // Verificar duplicados
      const isDuplicate = files.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      )
      
      if (isDuplicate) {
        newErrors.push(`${file.name}: Archivo duplicado`)
        return
      }

      validFiles.push(file)
    })

    return { validFiles, errors: newErrors }
  }

  // Manejar selección de archivos
  const handleFileSelect = (fileList) => {
    const { validFiles, errors: validationErrors } = validateFiles(fileList)
    
    setErrors(validationErrors)
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles]
      onChange(updatedFiles)
    }
  }

  // Manejar drag & drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  // Remover archivo
  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove)
    onChange(updatedFiles)
    setErrors([])
  }

  // Obtener ícono de archivo
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const iconClass = "w-8 h-8"
    
    switch (extension) {
      case 'pdf':
        return <File className={`${iconClass} text-red-500`} />
      case 'doc':
      case 'docx':
        return <File className={`${iconClass} text-blue-500`} />
      case 'xls':
      case 'xlsx':
        return <File className={`${iconClass} text-green-500`} />
      case 'ppt':
      case 'pptx':
        return <File className={`${iconClass} text-orange-500`} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <File className={`${iconClass} text-purple-500`} />
      case 'zip':
      case 'rar':
      case '7z':
        return <File className={`${iconClass} text-gray-500`} />
      default:
        return <File className={`${iconClass} text-gray-400`} />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zona de carga */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-primary-400 cursor-pointer'}
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && files.length < maxFiles && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled || files.length >= maxFiles}
        />
        
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">
            {files.length >= maxFiles 
              ? `Límite de ${maxFiles} archivos alcanzado`
              : 'Arrastra archivos aquí o haz clic para seleccionar'
            }
          </p>
          <p className="text-xs text-gray-500">
            Máximo {maxFiles} archivos, {formatFileSize(maxSizePerFile)} cada uno
          </p>
        </div>
      </div>

      {/* Errores de validación */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Errores de validación:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de archivos */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Archivos seleccionados ({files.length}/{maxFiles})
            </h4>
            
            <div className="grid gap-3">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.name)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  {!disabled && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      title="Eliminar archivo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileUpload