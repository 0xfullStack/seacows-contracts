// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/utils/Strings.sol';
import './BitMath.sol';
import 'base64-sol/base64.sol';

library NFTRenderer {
    uint256 public constant PERCENTAGE_PRECISION = 10 ** 4;

    struct RenderParams {
        address pool;
        uint256 id;
        string symbol;
        uint256 swapFee;
        uint256 poolShare;
        address owner;
    }

    function render(RenderParams memory params) public pure returns (string memory) {
        string memory image = string.concat(
            '<svg width="800" height="1066" viewBox="0 0 800 1066" fill="none" xmlns="http://www.w3.org/2000/svg" >',
            '<style> .text-quantico { font-family: "Quantico"; font-weight: bold; } .text-lg { font-size: 48px; } .text-md { font-size: 32px; } .text-sm { font-size: 24px; } </style>',
            '<defs> <style type="text/css"> @import url("https://fonts.googleapis.com/css?family=Quantico:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic"); </style> </defs>',
            renderForeground(),
            renderSnow(),
            renderCurve(),
            renderContent(params),
            renderBackground(),
            '</svg>'
        );
        string memory description = renderDescription(params);

        string memory json = string.concat(
            '{"name":"',
            renderName(params.poolShare, params.symbol),
            '",',
            '"description":"',
            description,
            '",',
            '"image":"data:image/svg+xml;base64,',
            Base64.encode(bytes(image)),
            '",',
            '"attributes": ',
            renderAttributes(params),
            '}'
        );

        return string.concat('data:application/json;base64,', Base64.encode(bytes(json)));
    }

    function renderName(uint256 poolShare, string memory symbol) internal pure returns (string memory name) {
        name = string.concat('SeaCows Swap Position V1 - ', convertToFloatString(_poolShare), '% - ', symbol);
    }

    function renderForeground() internal pure returns (string memory foreground) {
        foreground = string.concat(
            '<g clip-path="url(#clip0_4414_291095)">',
            renderForeground1(),
            renderForeground2(),
            renderForeground3(),
            '</g>'
        );
    }

    function renderForeground1() internal pure returns (string memory foreground1) {
        foreground1 = string.concat(
            '<rect width="800" height="1066" rx="16" fill="url(#paint0_linear_4414_291095)" /> <rect width="800" height="1066" rx="16" fill="url(#paint1_linear_4414_291095)" /> <rect width="800" height="1066" rx="16" fill="url(#paint2_linear_4414_291095)" />',
            '<path d="M306.5 1261C807.146 1261 1213 855.146 1213 354.5C1213 -146.146 807.146 -552 306.5 -552C-194.146 -552 -600 -146.146 -600 354.5C-600 855.146 -194.146 1261 306.5 1261Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.498 1235.41C793.01 1235.41 1187.41 841.01 1187.41 354.498C1187.41 -132.014 793.01 -526.41 306.498 -526.41C-180.014 -526.41 -574.41 -132.014 -574.41 354.498C-574.41 841.01 -180.014 1235.41 306.498 1235.41Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.499 1209.79C778.862 1209.79 1161.79 826.862 1161.79 354.499C1161.79 -117.863 778.862 -500.789 306.499 -500.789C-165.863 -500.789 -548.789 -117.863 -548.789 354.499C-548.789 826.862 -165.863 1209.79 306.499 1209.79Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.501 1184.2C764.73 1184.2 1136.2 812.73 1136.2 354.501C1136.2 -103.728 764.73 -475.195 306.501 -475.195C-151.728 -475.195 -523.195 -103.728 -523.195 354.501C-523.195 812.73 -151.728 1184.2 306.501 1184.2Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.498 1158.58C750.578 1158.58 1110.57 798.58 1110.57 354.5C1110.57 -89.5789 750.578 -449.576 306.498 -449.576C-137.581 -449.576 -497.578 -89.5789 -497.578 354.5C-497.578 798.58 -137.581 1158.58 306.498 1158.58Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.5 1132.98C736.445 1132.98 1084.98 784.445 1084.98 354.5C1084.98 -75.445 736.445 -423.984 306.5 -423.984C-123.445 -423.984 -471.984 -75.445 -471.984 354.5C-471.984 784.445 -123.445 1132.98 306.5 1132.98Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.502 1107.39C722.313 1107.39 1059.39 770.311 1059.39 354.5C1059.39 -61.3112 722.313 -398.393 306.502 -398.393C-109.309 -398.393 -446.391 -61.3112 -446.391 354.5C-446.391 770.311 -109.309 1107.39 306.502 1107.39Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.499 1081.77C708.161 1081.77 1033.77 756.163 1033.77 354.501C1033.77 -47.1604 708.161 -372.771 306.499 -372.771C-95.1623 -372.771 -420.773 -47.1604 -420.773 354.501C-420.773 756.163 -95.1623 1081.77 306.499 1081.77Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />'
        );
    }

    function renderForeground2() internal pure returns (string memory foreground2) {
        foreground2 = string.concat(
            '<path d="M306.501 1056.18C694.029 1056.18 1008.18 742.027 1008.18 354.499C1008.18 -33.0285 694.029 -347.182 306.501 -347.182C-81.0266 -347.182 -395.18 -33.0285 -395.18 354.499C-395.18 742.027 -81.0266 1056.18 306.501 1056.18Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.499 1030.56C679.877 1030.56 982.56 727.877 982.56 354.499C982.56 -18.8797 679.877 -321.562 306.499 -321.562C-66.8797 -321.562 -369.562 -18.8797 -369.562 354.499C-369.562 727.877 -66.8797 1030.56 306.499 1030.56Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.496 1004.97C665.74 1004.97 956.965 713.744 956.965 354.5C956.965 -4.74384 665.74 -295.969 306.496 -295.969C-52.7477 -295.969 -343.973 -4.74384 -343.973 354.5C-343.973 713.744 -52.7477 1004.97 306.496 1004.97Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.502 979.349C651.596 979.349 931.351 699.594 931.351 354.5C931.351 9.40491 651.596 -270.35 306.502 -270.35C-38.5931 -270.35 -318.348 9.40491 -318.348 354.5C-318.348 699.594 -38.5931 979.349 306.502 979.349Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.499 953.757C637.46 953.757 905.757 685.46 905.757 354.499C905.757 23.5388 637.46 -244.758 306.499 -244.758C-24.4612 -244.758 -292.758 23.5388 -292.758 354.499C-292.758 685.46 -24.4612 953.757 306.499 953.757Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.501 928.167C623.328 928.167 880.167 671.328 880.167 354.501C880.167 37.6747 623.328 -219.164 306.501 -219.164C-10.3253 -219.164 -267.164 37.6747 -267.164 354.501C-267.164 671.328 -10.3253 928.167 306.501 928.167Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.503 902.544C609.18 902.544 854.548 657.176 854.548 354.499C854.548 51.8215 609.18 -193.547 306.503 -193.547C3.82541 -193.547 -241.543 51.8215 -241.543 354.499C-241.543 657.176 3.82541 902.544 306.503 902.544Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.5 876.954C595.044 876.954 828.954 643.044 828.954 354.5C828.954 65.9573 595.044 -167.953 306.5 -167.953C17.9573 -167.953 -215.953 65.9573 -215.953 354.5C-215.953 643.044 17.9573 876.954 306.5 876.954Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.502 851.334C580.896 851.334 803.336 628.894 803.336 354.5C803.336 80.1061 580.896 -142.334 306.502 -142.334C32.1081 -142.334 -190.332 80.1061 -190.332 354.5C-190.332 628.894 32.1081 851.334 306.502 851.334Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.5 825.742C566.759 825.742 777.742 614.759 777.742 354.5C777.742 94.24 566.759 -116.742 306.5 -116.742C46.24 -116.742 -164.742 94.24 -164.742 354.5C-164.742 614.759 46.24 825.742 306.5 825.742Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />'
        );
    }

    function renderForeground3() internal pure returns (string memory foreground3) {
        foreground3 = string.concat(
            '<path d="M306.497 800.151C552.623 800.151 752.147 600.627 752.147 354.501C752.147 108.376 552.623 -91.1484 306.497 -91.1484C60.3718 -91.1484 -139.152 108.376 -139.152 354.501C-139.152 600.627 60.3718 800.151 306.497 800.151Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.499 774.531C538.475 774.531 726.529 586.477 726.529 354.501C726.529 122.525 538.475 -65.5293 306.499 -65.5293C74.5226 -65.5293 -113.531 122.525 -113.531 354.501C-113.531 586.477 74.5226 774.531 306.499 774.531Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.501 748.939C524.343 748.939 700.939 572.343 700.939 354.501C700.939 136.658 524.343 -39.9375 306.501 -39.9375C88.6585 -39.9375 -87.9375 136.658 -87.9375 354.501C-87.9375 572.343 88.6585 748.939 306.501 748.939Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.502 723.316C510.195 723.316 675.32 558.191 675.32 354.498C675.32 150.805 510.195 -14.3203 306.502 -14.3203C102.809 -14.3203 -62.3164 150.805 -62.3164 354.498C-62.3164 558.191 102.809 723.316 306.502 723.316Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.5 697.726C496.058 697.726 649.726 544.058 649.726 354.5C649.726 164.941 496.058 11.2734 306.5 11.2734C116.941 11.2734 -36.7266 164.941 -36.7266 354.5C-36.7266 544.058 116.941 697.726 306.5 697.726Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.501 672.134C481.926 672.134 624.136 529.924 624.136 354.5C624.136 179.075 481.926 36.8652 306.501 36.8652C131.077 36.8652 -11.1328 179.075 -11.1328 354.5C-11.1328 529.924 131.077 672.134 306.501 672.134Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.499 646.514C467.774 646.514 598.514 515.774 598.514 354.499C598.514 193.224 467.774 62.4844 306.499 62.4844C145.224 62.4844 14.4844 193.224 14.4844 354.499C14.4844 515.774 145.224 646.514 306.499 646.514Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.497 620.923C453.638 620.923 572.919 501.642 572.919 354.501C572.919 207.36 453.638 88.0781 306.497 88.0781C159.356 88.0781 40.0742 207.36 40.0742 354.501C40.0742 501.642 159.356 620.923 306.497 620.923Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.498 595.303C439.49 595.303 547.301 487.492 547.301 354.5C547.301 221.508 439.49 113.697 306.498 113.697C173.506 113.697 65.6953 221.508 65.6953 354.5C65.6953 487.492 173.506 595.303 306.498 595.303Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.5 569.711C425.358 569.711 521.711 473.358 521.711 354.5C521.711 235.642 425.358 139.289 306.5 139.289C187.642 139.289 91.2891 235.642 91.2891 354.5C91.2891 473.358 187.642 569.711 306.5 569.711Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.501 544.092C411.21 544.092 496.092 459.21 496.092 354.501C496.092 249.793 411.21 164.91 306.501 164.91C201.793 164.91 116.91 249.793 116.91 354.501C116.91 459.21 201.793 544.092 306.501 544.092Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.499 518.498C397.073 518.498 470.498 445.073 470.498 354.499C470.498 263.925 397.073 190.5 306.499 190.5C215.925 190.5 142.5 263.925 142.5 354.499C142.5 445.073 215.925 518.498 306.499 518.498Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.501 492.908C382.941 492.908 444.908 430.941 444.908 354.501C444.908 278.061 382.941 216.094 306.501 216.094C230.061 216.094 168.094 278.061 168.094 354.501C168.094 430.941 230.061 492.908 306.501 492.908Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
            '<path d="M306.502 467.288C368.793 467.288 419.29 416.791 419.29 354.5C419.29 292.21 368.793 241.713 306.502 241.713C244.211 241.713 193.715 292.21 193.715 354.5C193.715 416.791 244.211 467.288 306.502 467.288Z" stroke="white" stroke-opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />'
        );
    }

    function renderBackground() internal pure returns (string memory background) {
        background = string.concat(
            '<rect x="0.5" y="0.5" width="799" height="1065" rx="15.5" stroke="url(#paint7_linear_4414_291095)" />',
            '<defs> <filter id="filter0_b_4414_291095" x="86.8359" y="20.8359" width="236.547" height="236.547" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" >',
            '<feFlood flood-opacity="0" result="BackgroundImageFix" /> <feGaussianBlur in="BackgroundImageFix" stdDeviation="45.5" /> <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4414_291095" /> <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_4414_291095" result="shape" /> </filter>',
            '<filter id="filter1_b_4414_291095" x="-27.2422" y="456.77" width="374.816" height="374.807" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" >',
            '<feFlood flood-opacity="0" result="BackgroundImageFix" /> <feGaussianBlur in="BackgroundImageFix" stdDeviation="45.5" /> <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4414_291095" /> <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_4414_291095" result="shape" /> </filter>',
            '<linearGradient id="paint0_linear_4414_291095" x1="0" y1="533" x2="800" y2="533" gradientUnits="userSpaceOnUse" > <stop stop-color="#BBEF39" /> <stop offset="1" stop-color="#62EE17" /> </linearGradient>',
            '<linearGradient id="paint1_linear_4414_291095" x1="0" y1="533" x2="800" y2="533" gradientUnits="userSpaceOnUse" > <stop stop-color="#00FF87" /> <stop offset="1" stop-color="#60EFFF" /> </linearGradient>',
            '<linearGradient id="paint2_linear_4414_291095" x1="0" y1="0" x2="800" y2="1066" gradientUnits="userSpaceOnUse" > <stop stop-color="#1FA2FF" /> <stop offset="0.5" stop-color="#12D8FA" /> <stop offset="1" stop-color="#A6FFCB" /> </linearGradient>',
            '<linearGradient id="paint3_linear_4414_291095" x1="218.695" y1="115.583" x2="191.528" y2="162.637" gradientUnits="userSpaceOnUse" > <stop stop-color="white" /> <stop offset="1" stop-color="white" stop-opacity="0" /> </linearGradient>',
            '<linearGradient id="paint4_linear_4414_291095" x1="208.184" y1="561.013" x2="112.158" y2="727.334" gradientUnits="userSpaceOnUse" > <stop stop-color="white" /> <stop offset="1" stop-color="white" stop-opacity="0" /> </linearGradient>',
            '<linearGradient id="paint5_linear_4414_291095" x1="347" y1="301" x2="771.331" y2="782.156" gradientUnits="userSpaceOnUse" > <stop stop-color="white" stop-opacity="0.3" /> <stop offset="1" stop-color="white" stop-opacity="0" /> </linearGradient>',
            '<linearGradient id="paint6_linear_4414_291095" x1="532.5" y1="301" x2="532.5" y2="684" gradientUnits="userSpaceOnUse" > <stop stop-color="white" /> <stop offset="1" stop-color="white" stop-opacity="0.29" /> </linearGradient>',
            '<linearGradient id="paint7_linear_4414_291095" x1="-4.47205e-06" y1="224.5" x2="800" y2="829" gradientUnits="userSpaceOnUse" >',
            '<stop stop-color="#FFFFFE" stop-opacity="0.42" /> <stop offset="0.25" stop-color="white" stop-opacity="0.77" /> <stop offset="0.5" stop-color="white" stop-opacity="0" /> <stop offset="0.75" stop-color="white" stop-opacity="0.42" /> <stop offset="1" stop-color="white" stop-opacity="0.7" /> </linearGradient>',
            '<clipPath id="clip0_4414_291095"> <rect width="800" height="1066" rx="16" fill="white" /> </clipPath> </defs>'
        );
    }

    function renderContent(RenderParams memory params) internal pure returns (string memory content) {
        content = string.concat(
            renderPoolAddress(params.pool),
            renderId(params.id),
            renderSymbol(params.symbol),
            renderSwapFee(params.swapFee),
            renderPoolShare(params.poolShare),
            renderOwnerAddress(params.owner)
        );
    }

    function renderPoolAddress(address _pool) internal pure returns (string memory pool) {
        pool = string.concat(
            '<text x="41.36" y="57" fill="black" class="text-quantico text-sm">',
            'POOL: ',
            Strings.toHexString(_pool),
            '</text>'
        );
    }

    function renderOwnerAddress(address _owner) internal pure returns (string memory owner) {
        owner = string.concat(
            '<text x="50.08" y="1020.01" fill="black" class="text-quantico text-sm">',
            'Owner: ',
            Strings.toHexString(_owner),
            '</text>'
        );
    }

    function renderCurve() internal pure returns (string memory curve) {
        curve = string.concat(
            '<path d="M347 301V313.289C347 518.027 513.102 684 718 684" stroke="url(#paint5_linear_4414_291095)" stroke-width="79" stroke-linecap="round" />',
            '<path d="M320.333 301C320.333 315.728 332.272 327.667 347 327.667C361.728 327.667 373.667 315.728 373.667 301C373.667 286.272 361.728 274.333 347 274.333C332.272 274.333 320.333 286.272 320.333 301ZM691.333 684C691.333 698.728 703.272 710.667 718 710.667C732.728 710.667 744.667 698.728 744.667 684C744.667 669.272 732.728 657.333 718 657.333C703.272 657.333 691.333 669.272 691.333 684ZM342 301V313H352V301H342ZM342 313C342 520.659 510.341 689 718 689V679C515.864 679 352 515.136 352 313H342Z" fill="url(#paint6_linear_4414_291095)" />'
        );
    }

    function renderSnow() internal pure returns (string memory snow) {
        snow = string.concat(
            '<g filter="url(#filter0_b_4414_291095)"> <path d="M230.638 149.23L215.468 140.472L232.385 135.943L230.315 128.217L213.399 132.746L222.155 117.581L215.235 113.586L206.479 128.751L201.943 111.837L194.218 113.907L198.753 130.822L183.584 122.064L179.585 128.99L194.755 137.748L177.835 142.282L179.908 150.003L196.824 145.474L188.068 160.639L194.988 164.634L203.744 149.469L208.28 166.383L216.002 164.318L211.47 147.398L226.639 156.156L230.638 149.23Z" fill="url(#paint3_linear_4414_291095)" fill-opacity="0.6" /> </g>',
            '<g filter="url(#filter1_b_4414_291095)"> <path d="M250.399 679.945L196.78 648.988L256.574 632.979L249.258 605.67L189.464 621.679L220.414 568.074L195.954 553.952L165.005 607.558L148.972 547.77L121.664 555.089L137.697 614.876L84.0781 583.919L69.9434 608.401L123.562 639.358L63.7574 655.387L71.0843 682.676L130.878 666.667L99.9287 720.273L124.388 734.394L155.338 680.789L171.37 740.576L198.667 733.277L182.645 673.47L236.264 704.427L250.399 679.945Z" fill="url(#paint4_linear_4414_291095)" fill-opacity="0.6" /> </g>'
        );
    }

    function renderId(uint256 _id) internal pure returns (string memory id) {
        id = string.concat(
            '<text x="681.378" y="158.72" fill="black" class="text-quantico text-md">',
            '#',
            Strings.toString(_id),
            '</text>'
        );
    }

    function renderSymbol(string memory _symbol) internal pure returns (string memory symbol) {
        symbol = string.concat(
            '<text x="516.632" y="200.4" fill="black" class="text-quantico text-lg">',
            _symbol,
            '</text>'
        );
    }

    function renderPoolShare(uint256 _poolShare) internal pure returns (string memory poolShare) {
        poolShare = string.concat(
            '<text x="260.08" y="874" fill="black" class="text-quantico text-lg">',
            'Pool Share: ',
            convertToFloatString(_poolShare),
            '%',
            '</text>'
        );
    }

    function renderSwapFee(uint256 _swapFee) internal pure returns (string memory swapFee) {
        swapFee = string.concat(
            '<text x="346.08" y="803.96" fill="black" class="text-quantico text-lg">',
            'Swap Fee: ',
            convertToFloatString(_swapFee),
            '%',
            '</text>'
        );
    }

    function renderDescription(RenderParams memory params) internal pure returns (string memory description) {
        description = string.concat(
            'This NFT represents a liquidity position in a Seacows V1 ',
            params.symbol,
            ' pool. The owner of this NFT can modify or redeem the position.\n\nPool Address: ',
            Strings.toHexString(params.pool),
            '\n',
            'Azuki', // TODO; update erc721 name
            ' Address: ',
            '0xf37a233fdec2f7e1e91d1b2332891cd328aed2c5', // TODO; update erc721 address
            '\n',
            'ETH', // TODO; update erc20 name
            ' Address: ',
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // TODO; update erc20 address
            '\nFee Tier: ',
            convertToFloatString(params.swapFee),
            '%\nToken ID: ',
            Strings.toString(params.id),
            '\n\nDISCLAIMER: Due diligence is imperative when assessing this NFT. Make sure token addresses match the expected tokens, as token symbols may be imitated'
        );
    }

    function renderAttributes(RenderParams memory params) internal pure returns (string memory attributes) {
        attributes = string.concat(
            '[{',
            '"trait_type": "ERC20 Pair","value": "',
            'ETH', // TODO; update erc20 token
            '"},{"trait_type": "ERC721 Pair", "value": "',
            'Azuki', // TODO; update erc721
            '"},{"trait_type": "Fee Tier", "value": "',
            convertToFloatString(params.swapFee),
            '"}]'
        );
    }

    function convertToFloatString(uint256 value) internal pure returns (string memory) {
        uint256 precision = 10 ** 4;
        uint256 quotient = value / precision;
        uint256 remainderRaw = value % precision;

        string memory integerPart = Strings.toString(quotient);
        string memory fractionalPartRaw = Strings.toString(remainderRaw);
        string memory fractionalPart;

        if (remainderRaw != 0) {
            // remove trailing zeros
            uint256 remainder = remainderRaw;
            while (remainder != 0 && remainder % 10 == 0) {
                remainder = remainder / 10;
            }
            fractionalPart = Strings.toString(remainder);
            // Pad fractional part with zeros if needed
            uint256 fractionalPartLength = bytes(fractionalPartRaw).length;
            for (uint256 i = fractionalPartLength; i < 4; i++) {
                fractionalPart = string.concat('0', fractionalPart);
            }

            fractionalPart = string.concat('.', fractionalPart);
        }

        return string.concat(integerPart, fractionalPart);
    }
}
