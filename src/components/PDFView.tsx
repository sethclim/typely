import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { ResumeSection } from '../types'

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter'
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

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
	let str = section.template?.content || ''
	const dict = Object.fromEntries(section.dataItems.flatMap((item) => item.data))

	const lines = str.split('\n')

	const processed = lines
		.map((line) => {
			const replaced = line.replace(/\[\[(.*?)\]\]/g, (_, key) => {
				key = key.trim()
				const data = excapeLatexSymbolsInData(dict[key])
				return data ?? ''
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
