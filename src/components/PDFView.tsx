import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { ResumeSection } from '../types'

type PDFViewProps = {
	pdfUrl?: string | null
}

function excapeLatexSymbolsInData(input: string): string {
	const replacements: Record<string, string> = {
		'\\': '\\textbackslash{}',
		'&': '\\&',
		'%': '\\%',
		$: '\\$',
		'#': '\\#',
		_: '\\_',
		'{': '\\{',
		'}': '\\}',
		'~': '\\textasciitilde{}',
		'^': '\\textasciicircum{}'
	}

	// Build a regex that matches any of the special characters
	const pattern = new RegExp(
		`[${Object.keys(replacements)
			.map((c) => '\\' + c)
			.join('')}]`,
		'g'
	)

	return input.replace(pattern, (match) => replacements[match])
}

export const ReplaceVariables = (section: ResumeSection) => {
	const str = section.template?.content || ''
	const dict = Object.fromEntries(section.dataItems.flatMap((item) => item.data))

	const lines = str.split('\n')

	const processed = lines
		.map((line, index) => {
			console.log('Line ' + line)
			const replaced = line.replace(/\[\[(.*?)\]\]/g, (match, rawKey) => {
				const key = String(rawKey ?? '').trim()

				if (!key) {
					console.warn(`Empty template key in line ${index}:`, match)
					return ''
				}

				const value = dict?.[key]

				if (value === undefined || value === null) {
					console.warn(`Missing template value for key "${key}"`)
					return `[[MISSING:${key}]]`
				}

				console.log('VALUE', value)

				try {
					return excapeLatexSymbolsInData(String(value))
				} catch (err) {
					console.error(`Failed to escape LaTeX for key "${key}"`, err)
					return String(value)
				}
			})

			// remove \item lines that ended up empty
			if (/^\s*\\item\s*$/.test(replaced)) {
				return null
			}

			return replaced
		})
		.filter(Boolean)

	return processed.join('\n')
}

export const PDFView = (props: PDFViewProps) => {
	if (!props.pdfUrl) return null
	return (
		<div>
			<Document key={props.pdfUrl} className="bg-black overflow-hidden" file={props.pdfUrl}>
				<Page pageNumber={1} className="overflow-hidden" />
			</Document>
		</div>
	)
}
