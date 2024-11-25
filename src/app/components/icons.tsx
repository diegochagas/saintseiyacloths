export type iconName = 'arrow-up' | 'arrow-right' | 'menu' | 'close' | 'contact' | 'about' | 'artists' | 'classes' | 'history' | 'home' | 'news'

interface IconProps {
  name: iconName
  className?: string
  size?: number
  color?: string
}

export default function Icon({ name, className, size = 25, color = 'black' }: IconProps) {
  switch(name) {
    case 'arrow-up':
      return (
        <svg x="0px" y="0px" width={size} height={size} viewBox="0 0 20 20">
          <path fill={color} d="M18.008,7.667L16.606,9,11,3.627V20H9V3.627L3.392,9l-1.4-1.336L10-.012Z"></path>
        </svg>
      )
    case 'arrow-right':
      return (
        <svg className="rotate-90" x="0px" y="0px" width={size} height={size} viewBox="0 0 20 20">
          <path fill={color} d="M18.008,7.667L16.606,9,11,3.627V20H9V3.627L3.392,9l-1.4-1.336L10-.012Z"></path>
        </svg>
      )
    case 'menu':
      return (
        <>
          <i
            className="top-0 absolute block w-9 h-1.5 transition-all duration-200 ease-linear translate3d-0"
            style={{ backgroundColor: color }}
          />
          <i
            className="top-3.5 absolute block w-9 h-1.5 transition-all duration-200 ease-linear translate3d-0"
            style={{ backgroundColor: color }}
          />
          <i
            className="bottom-0.5 absolute block w-9 h-1.5 transition-all duration-200 ease-linear translate3d-0"
            style={{ backgroundColor: color }}
          />
        </>
      )
    case 'close':
      return (
        <>
          <i
            className="top-[-1px] left-0.5 rotate-45 origin-[0_100%] absolute block w-9 h-1.5 transition-all duration-200 ease-linear"
            style={{ backgroundColor: color }}
          />
          <i
            className="bottom-1 left-0.5 -rotate-45 origin-[0_0] absolute block w-9 h-1.5 transition-all duration-200 ease-linear"
            style={{ backgroundColor: color }}
          />
        </>
      )
    case 'contact':
      return (
        <svg className={className} x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20">
          <path fill={color} d="M16,17H4a2,2,0,0,1-2-2V5A2,2,0,0,1,4,3H16a2,2,0,0,1,2,2V15A2,2,0,0,1,16,17Zm0-2V7.619l-6,4.242L4,7.619V15H16ZM4,5V5.705l6,3.429,6-3.429V5H4Z"></path>
        </svg>
      )
    case 'about':
      return (
        <svg className={className} fill={color} height={size} width={size} viewBox="0 0 270.125 270.125" xmlSpace="preserve">
          <path
            colorRendering="auto"
            imageRendering="auto"
            shapeRendering="auto"
            colorInterpolation="sRGB"
            d="M33.892,70.088
            c-19.537,1.555-35.578,18.669-33.75,38.771c1.569,17.255,16.823,31.414,34.676,29.519c14.97-1.588,27.251-14.994,25.264-30.604
            c-1.615-12.681-13.199-23.104-26.578-20.975c-10.387,1.653-18.976,11.473-16.606,22.643c0.859,4.047,3.183,7.559,6.492,9.941
            c3.309,2.382,7.922,3.55,12.416,2.119c2.944-0.937,5.294-2.818,6.887-5.521c1.593-2.704,2.11-6.917-0.02-10.262
            c-1.717-2.698-3.293-3.232-5.766-3.648c-1.236-0.208-2.965-0.285-4.805,0.912c-1.84,1.197-2.815,3.672-2.815,5.422
            c-0.017,1.336,0.5,2.623,1.438,3.574c-0.491-0.141-0.978-0.339-1.494-0.711c-1.205-0.868-2.243-2.443-2.553-3.902
            c-1.059-4.992,3.23-9.867,8.395-10.69c7.348-1.17,14.144,4.951,15.088,12.359c1.231,9.671-6.743,18.372-16.4,19.396
            c-11.975,1.271-22.577-8.57-23.66-20.48C8.803,93.684,20.517,81.184,34.685,80.057c0.126-0.01,0.253-0.016,0.379-0.023h200
            c0.126,0.01,0.252,0.014,0.377,0.023c14.168,1.127,25.882,13.627,24.584,27.896c-1.083,11.911-11.685,21.751-23.66,20.48
            c-9.658-1.025-17.632-9.726-16.4-19.396c0.943-7.409,7.739-13.529,15.088-12.359c5.165,0.822,9.454,5.697,8.394,10.69
            c-0.31,1.459-1.348,3.035-2.553,3.902c-0.516,0.371-1,0.57-1.49,0.711c0.936-0.952,1.452-2.239,1.434-3.574
            c0-1.75-0.973-4.225-2.812-5.422c-1.84-1.197-3.568-1.12-4.805-0.912c-2.473,0.416-4.05,0.951-5.768,3.648
            c-2.129,3.344-1.611,7.558-0.018,10.262c1.593,2.704,3.943,4.585,6.887,5.521c4.494,1.43,9.105,0.263,12.414-2.119
            s5.633-5.894,6.492-9.941c2.37-11.169-6.219-20.989-16.605-22.643c-13.379-2.129-24.964,8.294-26.578,20.975
            c-1.988,15.61,10.296,29.015,25.266,30.604c17.852,1.894,33.105-12.264,34.674-29.52c1.828-20.102-14.213-37.217-33.75-38.771
            c-0.406-0.062-0.781-0.037-1.17-0.045h-200c-0.389-0.024-0.8,0.021-1.172,0.047L33.892,70.088z M15.063,20.063c-2.761,0-5,2.239-5,5
            v10c0,1.326,0.527,2.598,1.465,3.535l20,20c0.938,0.938,2.209,1.465,3.535,1.465h200c1.326,0,2.598-0.527,3.535-1.465l20-20
            c0.938-0.938,1.465-2.209,1.465-3.535v-10c0-2.761-2.239-5-5-5C255.063,20.063,15.063,20.063,15.063,20.063z M20.063,30.063h230
            v2.928l-17.072,17.072H37.133l-17.07-17.072V30.063z M75.063,100.063c-2.761,0-5,2.239-5,5v140c0.001,2.762,2.24,5,5.002,4.999
            c0.987,0,1.951-0.292,2.772-0.839l28.441-18.963c1.366-0.91,2.198-2.433,2.227-4.074l1.557-91.039c0-0.028,0-0.056,0-0.084
            c0-3.28,10.058-3.373,10-0.09c0,0.03,0,0.06,0,0.09v80c0.001,2.762,2.24,5,5.002,4.999c0.987,0,1.951-0.292,2.772-0.839l30-20
            c1.391-0.927,2.226-2.488,2.227-4.16v-60c0-3.339,10-3.339,10,0v50c0.001,2.762,2.241,5,5.003,4.998c0.775,0,1.54-0.181,2.234-0.528
            l20-10c1.693-0.847,2.763-2.577,2.764-4.471v-70c0-2.761-2.239-5-5-5h-120H75.063z M80.063,110.063h110v61.908l-10,5v-41.908
            c0-16.668-30-16.668-30,0v57.324l-20,13.334v-70.658v0.088c0.297-16.724-29.998-16.815-29.998-0.088v-0.086l-1.512,88.418
            l-18.488,12.326V110.063L80.063,110.063z"
          />
        </svg>
      )
    case 'artists':
      return (
        <svg className={className} fill={color} height={size} width={size} viewBox="0 0 325 325" xmlSpace="preserve">
          <path d="M297.992,40.603c-5.42-5.42-12.962-8.168-22.416-8.168c-5.83,0-12.268,1.079-19.121,3.114V6c0-3.313-2.686-6-6-6H24.872
            c-3.313,0-6,2.687-6,6v313c0,3.314,2.687,6,6,6H214.36c0.213,0,0.423-0.012,0.63-0.033c0.029-0.004,0.058-0.01,0.088-0.014
            c0.179-0.021,0.356-0.048,0.53-0.085c0.032-0.007,0.063-0.017,0.095-0.024c0.17-0.039,0.338-0.083,0.502-0.136
            c0.041-0.013,0.08-0.03,0.121-0.044c0.151-0.053,0.302-0.109,0.448-0.174c0.052-0.022,0.102-0.049,0.152-0.073
            c0.131-0.061,0.26-0.126,0.385-0.197c0.062-0.034,0.12-0.071,0.18-0.108c0.111-0.068,0.221-0.139,0.327-0.213
            c0.064-0.046,0.127-0.094,0.189-0.143c0.097-0.074,0.191-0.15,0.283-0.23c0.063-0.055,0.126-0.111,0.186-0.169
            c0.088-0.083,0.172-0.167,0.254-0.255c0.033-0.035,0.07-0.066,0.103-0.104l36.096-40.387c0.015-0.017,0.024-0.036,0.039-0.053
            c0.212-0.242,0.402-0.5,0.573-0.773c0.024-0.039,0.049-0.078,0.072-0.117c0.164-0.277,0.307-0.567,0.426-0.871
            c0.014-0.035,0.026-0.072,0.04-0.108c0.113-0.308,0.205-0.624,0.267-0.953c0.006-0.03,0.009-0.062,0.014-0.093
            c0.059-0.335,0.095-0.678,0.095-1.029V155.408c2.332-2.461,4.628-4.963,6.855-7.491c1.474-1.672,1.898-4.023,1.104-6.107
            l-3.693-9.67l24.05-13.654c0.869-0.494,1.602-1.197,2.131-2.047C307.784,82.892,311.93,54.542,297.992,40.603z M30.872,12h213.583
            v27.908c-19.319,8.236-40.87,22.911-61.215,42.187c-0.713,0.676-1.249,1.516-1.561,2.447l-8.476,25.264l-10.306-1.647
            c-2.138-0.347-4.294,0.494-5.642,2.188c-27.152,34.109-28.332,79.092-28.152,90.661L95.121,234.99c-2.344,2.343-2.344,6.142,0,8.484
            c1.171,1.172,2.707,1.758,4.242,1.758c1.535,0,3.071-0.586,4.242-1.758l34.217-34.217c12.104-0.921,66.283-6.93,106.633-42.145
            v105.5H214.36c-3.313,0-6,2.686-6,6V313H30.872V12z M237.046,284.613l-16.687,18.67v-18.67H237.046z M277.509,108.81l-27.193,15.439
            c-2.578,1.464-3.7,4.59-2.644,7.358l4.229,11.071c-2.987,3.3-6.075,6.544-9.21,9.678c-28.613,28.614-68.598,39.173-90.952,42.984
            l66.969-66.969c2.344-2.343,2.344-6.142,0-8.484c-2.342-2.344-6.143-2.344-8.484,0l-68.665,68.665
            c1.289-16.787,6.073-45.04,22.979-67.98l11.791,1.885c2.904,0.46,5.703-1.235,6.636-4.017l9.614-28.655
            c19.957-18.695,41.295-32.87,59.542-40.071c0.357-0.103,0.699-0.239,1.026-0.403c8.282-3.17,15.902-4.876,22.431-4.876
            c6.156,0,10.843,1.565,13.931,4.653C298.789,58.371,294.068,81.723,277.509,108.81z"/>
        </svg>
      )
    case 'classes':
      return (
        <svg width={size} height={size} viewBox="0 0 512 512">
          <path
            className={className}
            fill={color}
            d="M253.714 20.358c-8.79.075-17.448.82-25.89 2.308-46.55 8.208-89.423 26.157-121.225 52.065-31.803 25.908-52.572 59.39-56.316 100.053l-.004.04-.004.04c-8.45 83.885 39.397 152.37 65.604 181.553 5.21 5.804 7.064 13.574 6.533 20.862-.53 7.288-3.04 14.494-6.598 21.838-7.114 14.688-18.703 30.06-31.03 44.457-13.957 16.303-27.375 29.703-37.75 39.627 7.203-1.214 14.764-4.37 22.67-9.368 14.66-9.265 29.554-24.475 42.097-41.298 12.543-16.824 22.807-35.28 28.802-50.586 2.998-7.654 4.912-14.54 5.614-19.72.7-5.178-.177-8.39-.354-8.687-15.34-25.73-31.257-52.027-40.687-79.112-9.43-27.085-12.2-55.565-.073-83.35 25.223-57.79 78.02-85.085 130.772-89.605 52.61-4.508 105.963 12.396 136.545 44.71l23.292 22.474 69.254-41.47c-20.34-26.314-55.49-55.33-96.24-76.257-33.546-17.226-70.702-28.978-106.18-30.428-2.957-.12-5.902-.17-8.832-.144zM372.42 146.184l-.058-.057.31.313c-.083-.087-.17-.17-.25-.256zM244.814 118.95c-2.468.102-4.935.245-7.4.457-3.562.305-7.11.73-10.64 1.255l9.628 45.077c5.76-1.637 11.657-2.823 17.646-3.564l-9.233-43.226zm43.85 3.658c-4.866 12.845-7.33 25.916-6.978 39.04 6.034.48 12.086 1.335 18.12 2.557-.868-12.19 1.306-24.43 6.362-36.98-5.66-1.82-11.515-3.363-17.504-4.617zm-106.672 11.79c-6.112 3.028-12 6.54-17.612 10.532 17.55 8.862 29.7 22.763 34.715 39.594 4.936-3.84 10.145-7.183 15.564-10.063-6.122-16.257-17.577-30.086-32.666-40.063zm88.136 44.796c-1.156-.002-2.308.014-3.457.047-2.675.076-5.328.242-7.952.502-41.993 4.176-77.31 30.258-87.475 90.07-2.198 12.94 4.293 42.822 12.246 67.66 7.952 24.836 16.634 45.517 16.634 45.517l.504 1.198.143 1.295c1.96 17.7-9.11 34.967-21.212 52.26-8.036 11.486-16.43 22.104-23.97 31.72 24-1.35 45.963-11.985 67.177-30.947-.124-.5-.17-.71-.313-1.297-.866-3.594-1.955-8.697-1.687-14.68.446-9.983 5.674-21.958 18.818-31.868-24.577-35.02-28.898-78.757-24.06-115.027l.886-6.65 6.626-1.05c58.715-9.29 97.246-28.81 139.34-54.593-27.566-21.88-61.198-34.115-92.25-34.158zm120.197 37.84c-48.424 30.517-91.56 55.67-157.556 67.35-3.253 33.408 2.427 71.84 25.226 100.798 12.607.61 23.264 6.977 29.904 16.184 6.747 9.353 9.946 21.162 10.83 33.628 23.288 21.426 62.97 39.024 97.764 56.655-3.17-39.444-.296-76.34-14.538-114.11l-62.842-25.3-.062-.027c-14.313-6.018-23.332-13.792-26.512-24.03-3.18-10.236-.874-19.966 1.188-31.064l2.2-11.852 10.74 5.476c23.407 11.94 51.394 20.52 77.548 20.065l6.582-.116 2.103 6.238c10.593 31.436 12.912 56.612 15.752 82.203l7.787 3.113c4.126-29.38 1.912-68.686-3.862-104.425-5.463-33.817-14.72-65.03-22.252-80.788zM223.397 441.148c-.01.444.094.455.01.04-.002-.008-.01-.033-.01-.04z"
          />
        </svg>
      )
    case 'history':
      return (
        <svg className={className} fill={color} height={size} width={size} viewBox="0 0 195.92 195.92" xmlSpace="preserve">
          <path d="M137.146,195.92H58.774c-1.104,0-2-0.896-2-2c0-6.032,4.519-10.993,10.239-11.455c-3.199-2.179-7.238-5.551-11.968-10.758
	c-0.1-0.091-0.191-0.191-0.271-0.3c-3.733-4.143-7.892-9.426-12.403-16.159c-15.676-23.396-15.497-61.919-14.691-77.395
	c0.209-4.017,3.098-7.375,7.025-8.168c10.833-2.188,36.029-9.529,36.029-30.414c0-11.315-3.314-19.357-7.17-24.885
	c-0.056-0.069-0.107-0.143-0.153-0.219c-1.451-2.046-2.972-3.741-4.418-5.124c-1.571-1.5-2.066-3.768-1.261-5.775
	C58.527,1.283,60.428,0,62.575,0h70.771c2.146,0,4.048,1.283,4.844,3.269c0.805,2.008,0.31,4.275-1.262,5.776
	c-1.447,1.383-2.968,3.078-4.419,5.126c-0.045,0.074-0.095,0.146-0.15,0.213c-3.857,5.527-7.172,13.57-7.172,24.888
	c0,20.885,25.196,28.227,36.029,30.414c3.928,0.793,6.817,4.151,7.025,8.168c0.805,15.476,0.985,53.998-14.691,77.395l-1.662-1.113
	l1.662,1.113c-4.511,6.733-8.669,12.015-12.402,16.157c-0.081,0.11-0.173,0.212-0.274,0.304c-4.73,5.207-8.768,8.577-11.967,10.756
	c5.721,0.461,10.239,5.423,10.239,11.455C139.146,195.024,138.25,195.92,137.146,195.92z M61.031,191.92h73.857
	c-0.833-3.162-3.59-5.49-6.854-5.49h-60.15C64.622,186.43,61.864,188.758,61.031,191.92z M75.769,182.43h44.393
	c0.703-0.156,6.052-1.586,14.699-10.207H61.061C69.648,180.782,74.988,182.254,75.769,182.43z M57.292,168.223h81.336
	c3.475-3.907,7.362-8.879,11.598-15.201l0,0c8.952-13.36,12.492-32.09,13.724-48.229H31.969
	c1.232,16.139,4.772,34.868,13.725,48.229C49.93,159.344,53.817,164.315,57.292,168.223z M147.806,100.793h16.408
	c0.364-6.563,0.368-12.553,0.241-17.383H31.465c-0.127,4.83-0.124,10.819,0.241,17.383h2.632V87.901c0-1.104,0.896-2,2-2h13.776
	c1.104,0,2,0.896,2,2v7.884c0,1.104-0.896,2-2,2h-7.872c-1.104,0-2-0.896-2-2s0.896-2,2-2h5.872v-3.884h-9.776v10.892h17.894V87.901
	c0-1.104,0.896-2,2-2h13.776c1.104,0,2,0.896,2,2v7.884c0,1.104-0.896,2-2,2h-7.872c-1.104,0-2-0.896-2-2s0.896-2,2-2h5.872v-3.884
	h-9.776v10.892h17.894V87.901c0-1.104,0.896-2,2-2h13.776c1.104,0,2,0.896,2,2v7.884c0,1.104-0.896,2-2,2h-7.872
	c-1.104,0-2-0.896-2-2s0.896-2,2-2h5.872v-3.884h-9.776v10.892h17.894V87.901c0-1.104,0.896-2,2-2h13.776c1.104,0,2,0.896,2,2v7.884
	c0,1.104-0.896,2-2,2h-7.872c-1.104,0-2-0.896-2-2s0.896-2,2-2h5.872v-3.884h-9.776v10.892h17.894V87.901c0-1.104,0.896-2,2-2
	h13.776c1.104,0,2,0.896,2,2v7.884c0,1.104-0.896,2-2,2h-7.872c-1.104,0-2-0.896-2-2s0.896-2,2-2h5.872v-3.884h-9.776v10.892h17.894
	V87.901c0-1.104,0.896-2,2-2h13.776c1.104,0,2,0.896,2,2v7.884c0,1.104-0.896,2-2,2h-7.872c-1.104,0-2-0.896-2-2s0.896-2,2-2h5.872
	v-3.884h-9.776V100.793z M31.608,79.41h132.704c-0.021-0.468-0.043-0.918-0.065-1.35c-0.114-2.191-1.686-4.023-3.823-4.454
	c-11.797-2.383-39.237-10.496-39.237-34.335c0-10.386,2.598-18.276,5.963-24.141H68.771c3.365,5.864,5.963,13.755,5.963,24.141
	c0,23.839-27.44,31.952-39.237,34.335c-2.137,0.431-3.708,2.263-3.823,4.454C31.651,78.492,31.629,78.942,31.608,79.41z
	 M66.15,11.131h63.621c1.454-1.955,2.958-3.604,4.395-4.978c0.585-0.56,0.387-1.21,0.312-1.396C134.386,4.529,134.093,4,133.346,4
	H62.575c-0.747,0-1.04,0.529-1.131,0.758c-0.075,0.186-0.273,0.837,0.312,1.395C63.192,7.526,64.696,9.176,66.15,11.131z"/>
        </svg>
      )
    case 'home':
      return (
        <svg width={size} height={size} viewBox="0 0 512 512">
          <path className={className} fill={color} d="M256 26.2L52 135h408L256 26.2zM73 153v14h366v-14H73zm16 32v206h30V185H89zm101.334 0v206h30V185h-30zm101.332 0v206h30V185h-30zM393 185v206h30V185h-30zM73 409v30h366v-30H73zm-32 48v30h430v-30H41z"/>
        </svg>
      )
    case 'news':
      return (
        <svg className={className} fill={color} height={size} width={size} viewBox="0 0 360.996 360.996" xmlSpace="preserve">
          <g>
            <path d="M337.34,329.642l-9.505-0.559c-1.107-8.977-4.136-15.032-4.369-15.486c-0.01-0.018-0.022-0.035-0.031-0.054
              c-0.065-0.125-0.14-0.246-0.213-0.367c-0.057-0.096-0.11-0.193-0.171-0.285c-0.058-0.087-0.122-0.169-0.183-0.253
              c-0.085-0.117-0.167-0.236-0.257-0.347c-0.039-0.048-0.083-0.092-0.123-0.139c-0.118-0.137-0.235-0.274-0.361-0.401
              c-0.048-0.048-0.101-0.091-0.149-0.139c-0.122-0.117-0.244-0.234-0.373-0.342c-1.112-0.932-2.505-1.552-4.057-1.708l-17.567-1.775
              V127.494c0-1.262-0.318-2.504-0.926-3.61l-9-16.39l9-16.391c0.607-1.106,0.926-2.348,0.926-3.61V52.895l14.751-1.468
              c0.051-0.005,0.1-0.017,0.149-0.022c0.098-0.012,0.192-0.028,0.289-0.043c0.227-0.036,0.451-0.083,0.672-0.138
              c0.074-0.019,0.148-0.036,0.223-0.057c0.6-0.172,1.163-0.416,1.688-0.721c0.068-0.04,0.135-0.082,0.203-0.124
              c0.205-0.128,0.403-0.266,0.594-0.413c0.059-0.045,0.12-0.086,0.178-0.133c0.227-0.185,0.44-0.383,0.644-0.593
              c0.063-0.066,0.124-0.137,0.185-0.206c0.154-0.171,0.301-0.35,0.439-0.535c0.052-0.07,0.105-0.137,0.155-0.21
              c0.177-0.255,0.339-0.52,0.482-0.796c0.009-0.016,0.021-0.03,0.028-0.046c0.232-0.454,3.262-6.509,4.369-15.486l9.505-0.559
              c4.135-0.243,7.29-3.792,7.047-7.927c-0.243-4.135-3.781-7.293-7.928-7.047l-8.945,0.526c-0.669-3.906-1.855-8.007-3.756-12.193
              c-0.007-0.016-0.015-0.031-0.021-0.046c-0.048-0.106-0.09-0.211-0.139-0.317c-0.018-0.039-0.041-0.074-0.059-0.112
              c-0.07-0.144-0.145-0.284-0.223-0.423c-0.049-0.086-0.098-0.171-0.148-0.254c-0.073-0.117-0.149-0.231-0.229-0.343
              c-0.067-0.098-0.136-0.194-0.208-0.288c-0.068-0.09-0.141-0.176-0.214-0.262c-0.089-0.105-0.179-0.209-0.272-0.309
              c-0.065-0.069-0.134-0.136-0.202-0.202c-0.106-0.105-0.213-0.207-0.324-0.304c-0.069-0.06-0.141-0.116-0.212-0.174
              c-0.115-0.093-0.23-0.185-0.351-0.27c-0.08-0.058-0.164-0.111-0.247-0.166c-0.114-0.075-0.229-0.15-0.348-0.219
              c-0.099-0.057-0.199-0.109-0.301-0.162c-0.107-0.056-0.216-0.113-0.325-0.164c-0.115-0.053-0.233-0.101-0.352-0.148
              c-0.104-0.042-0.207-0.084-0.312-0.121c-0.123-0.043-0.248-0.08-0.373-0.117c-0.108-0.032-0.217-0.063-0.327-0.091
              c-0.119-0.029-0.24-0.053-0.361-0.076c-0.123-0.024-0.246-0.047-0.371-0.064c-0.107-0.015-0.216-0.026-0.324-0.036
              c-0.145-0.015-0.289-0.025-0.434-0.031C314.184,0.001,314.089,0,313.994,0c-0.159,0-0.318,0.004-0.478,0.014
              c-0.044,0.003-0.087,0.001-0.131,0.004L46.872,21.526c-3.108,0.25-5.619,2.363-6.528,5.154c-0.851,2.063-2.963,7.8-3.868,15.757
              L23.22,43.996c-4.114,0.484-7.056,4.211-6.572,8.325c0.449,3.816,3.689,6.624,7.44,6.624c0.292,0,0.588-0.017,0.886-0.052
              l11.54-1.357c0.6,4.95,1.837,10.248,4.011,15.717c0.134,0.339,0.296,0.661,0.475,0.972c0.028,0.049,0.056,0.099,0.085,0.148
              c0.17,0.281,0.357,0.549,0.562,0.804c0.045,0.057,0.093,0.11,0.14,0.165c0.197,0.232,0.404,0.453,0.628,0.659
              c0.023,0.021,0.044,0.045,0.068,0.067c0.239,0.214,0.495,0.408,0.76,0.591c0.058,0.04,0.114,0.08,0.173,0.118
              c0.27,0.175,0.549,0.335,0.84,0.475c0.04,0.019,0.081,0.036,0.121,0.054c0.288,0.132,0.584,0.248,0.89,0.343
              c0.026,0.008,0.051,0.019,0.077,0.026c0.313,0.094,0.635,0.165,0.962,0.217c0.067,0.011,0.134,0.02,0.202,0.029
              c0.317,0.042,0.637,0.071,0.963,0.072c0.011,0,0.022,0.002,0.033,0.002c0.246,0,0.493-0.015,0.741-0.039l12.307-1.225v128.762
              c0,0.96,0.184,1.91,0.542,2.8l7.265,18.054l-7.16,16.099c-0.426,0.96-0.647,1.998-0.647,3.048v38.099l-11.384-1.15
              c-3.81-0.384-7.251,2.167-8.067,5.823c-1.97,5.205-3.109,10.245-3.661,14.965l-9.657-1.136c-4.121-0.49-7.841,2.459-8.325,6.572
              c-0.484,4.114,2.458,7.841,6.572,8.325l11.424,1.344c1.054,8.958,3.625,15.045,4.122,16.158c0.008,0.019,0.017,0.039,0.026,0.058
              c0.018,0.039,0.036,0.08,0.045,0.1c0.013,0.029,0.032,0.054,0.046,0.083c0.127,0.266,0.271,0.522,0.428,0.77
              c0.037,0.06,0.072,0.12,0.111,0.178c0.173,0.257,0.361,0.503,0.564,0.736c0.053,0.06,0.108,0.115,0.163,0.174
              c0.174,0.188,0.357,0.366,0.55,0.535c0.051,0.045,0.101,0.092,0.153,0.135c0.249,0.207,0.511,0.399,0.787,0.573
              c0.009,0.005,0.018,0.01,0.028,0.017c0.284,0.177,0.583,0.334,0.892,0.474c0.006,0.003,0.013,0.006,0.02,0.009
              c0.756,0.338,1.577,0.564,2.45,0.636l268.347,22c0.151,0.012,0.301,0.015,0.45,0.019c0.053,0.001,0.105,0.008,0.158,0.008
              c0.013,0,0.025-0.003,0.037-0.003c0.309-0.001,0.61-0.026,0.91-0.064c0.072-0.009,0.145-0.02,0.218-0.032
              c0.632-0.099,1.238-0.275,1.812-0.523c0.06-0.026,0.12-0.053,0.18-0.081c0.279-0.13,0.553-0.271,0.813-0.433
              c0.016-0.01,0.032-0.021,0.048-0.031c0.248-0.157,0.482-0.332,0.709-0.517c0.071-0.058,0.141-0.116,0.21-0.175
              c0.224-0.196,0.439-0.402,0.64-0.623c0.038-0.042,0.071-0.088,0.108-0.131c0.183-0.211,0.352-0.434,0.51-0.665
              c0.036-0.053,0.073-0.104,0.108-0.158c0.179-0.276,0.339-0.565,0.48-0.865c0.008-0.017,0.019-0.03,0.026-0.047
              c1.999-4.313,3.227-8.538,3.915-12.557l8.945,0.526c0.15,0.009,0.299,0.013,0.447,0.013c3.94,0,7.246-3.075,7.48-7.06
              C344.63,333.434,341.475,329.885,337.34,329.642z M53.915,324.417c-1.483-5.241-3.275-15.15-0.224-26.44l257.806,26.05
              c1.404,4.438,2.994,12.479,0.297,21.532L53.915,324.417z M52.715,62.438c-3.016-11.258-1.223-21.134,0.256-26.355l256.015-20.661
              c2.699,9.051,1.112,17.092-0.293,21.533L52.715,62.438z M75.548,247.086l7.803-17.545c0.825-1.855,0.862-3.964,0.105-5.848
              l-7.908-19.652V75.238L284.98,54.389V85.57l-10.057,18.314c-1.234,2.248-1.234,4.972,0,7.22l10.057,18.313v176.854L75.548,285.108
              V247.086z"/>
            <path d="M251.334,104.729h-145.88c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h145.88c4.143,0,7.5-3.358,7.5-7.5
              S255.477,104.729,251.334,104.729z"/>
            <path d="M251.334,149.927h-145.88c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h145.88c4.143,0,7.5-3.358,7.5-7.5
              C258.834,153.285,255.477,149.927,251.334,149.927z"/>
            <path d="M251.334,195.125h-145.88c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h145.88c4.143,0,7.5-3.358,7.5-7.5
              C258.834,198.483,255.477,195.125,251.334,195.125z"/>
            <path d="M251.334,240.323h-145.88c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h145.88c4.143,0,7.5-3.358,7.5-7.5
              C258.834,243.681,255.477,240.323,251.334,240.323z"/>
          </g>
        </svg>
      )
    default:
      return <span />
  }
}