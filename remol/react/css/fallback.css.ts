import { css } from './css'

css(`
[wire_view_error]:not([wire_view_error="Promise"]) {
	background-image: repeating-linear-gradient(
		-45deg,
		#f92323,
		#f92323 .5rem,
		#ff3d3d .5rem,
		#ff3d3d 1.5rem
	);
	color: black;
	align-items: center;
    justify-content: center;
}

@keyframes remol_view_wait_move {
	from {
		background-position: 0 0;
	}
	to {
		background-position: 200vmax 0;
	}
}

@keyframes remol_view_wait_show {
	to {
		background-image: repeating-linear-gradient(
			45deg,
			hsla( 0 , 0% , 50% , .5 ) 0% ,
			hsla( 0 , 0% , 50% , 0 ) 5% ,
			hsla( 0 , 0% , 50% , 0 ) 45% ,
			hsla( 0 , 0% , 50% , .5 ) 50% ,
			hsla( 0 , 0% , 50% , 0 ) 55% ,
			hsla( 0 , 0% , 50% , 0 ) 95% ,
			hsla( 0 , 0% , 50% , .5 ) 100%
		);
		background-size: 200vmax 200vmax;
	}
}

[wire_view_error="Promise"] {
	animation: remol_view_wait_show .5s .5s linear forwards , remol_view_wait_move 1s linear infinite;
	opacity: .75;
}`)
