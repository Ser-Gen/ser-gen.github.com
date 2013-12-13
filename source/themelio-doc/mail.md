## �� ������

[��� ������ ���������� � ������� 2010](http://stackoverflow.com/a/12019156)

[����� � ������ ��������](http://habrahabr.ru/post/157309/)

������ ����� ��������� ������� �������� ����� ������������, ����� �� ����� �������� ������.

����������� ��������� ������������ ������ ���� ������. ��������� ������� ������� �� ��������, � ������� ���� ������� %7� = |, ��������.

��� ������� ����������� �� �������� ������� ������������ ����� ������, �� ����� ��������� ��� ������ [����������� ����������](http://summerstyle.github.io/summer/).

[����������](http://backgrounds.cm/) ��� ������� ������� ����������� � [�������� ������](http://buttons.cm/).

> ����������� ������ �������, ���������� �����, ��������������� �� (��������, `font-family` ���������� ��� ������� ��������). [#](https://twitter.com/devongovett/status/361603759878574080)

> �� ��������� ������������ `margin` ��� �����, ������ ����� ������������ ��. `color: #000001` ������ ������� ������� ��������� ������ � ������. [#](https://twitter.com/devongovett/status/361603942473404416)

> ���� `style` ���������� ������������ �������� ��������. ����������� ������� ��� ����������. ������������� ��������� ��� :active � �������. [#](https://twitter.com/devongovett/status/361604328378740736)

> Another email protip: if you embed your images as attachments (using cid: links) instead of HTTP, you get around image blocking until click. [#](https://twitter.com/devongovett/status/361606975387205632)

> I used this Node module to automatically convert CSS files to inline styles. Works well. https://github.com/LearnBoost/juice [#](https://twitter.com/devongovett/status/361607442536202241)

������ ��������� �� ��������� ����������� � ����� ���������� ������ �� �������� � **������** �� ���������� �������� ������.

**�����** ������������� ���� ���� ��� ������, ��� ������� �������� ���������� � ��� �� ������ ��������. ����� ��������� ���� �� �������� `#000001 == #000`.


## ������

������� ������� �������� ������� ��������� �� ��������� ���������, ��� ��� ������� ����� �� �����������.

���� ���������������� ������������ ���� �����������, ��� ������������ ���������� ������ ����������� ��� ������� 2010 (� ������ � �� ������������ �������� � �������) � `1600px`.

[������� ����������� �������](http://stackoverflow.com/a/8914220)

[��� ������� ����������� � ���������](http://www.emailonacid.com/blog/details/C13/emailology_vector_markup_language_and_backgrounds)

[��������� ���������� �����������](http://www.campaignmonitor.com/css/)

[������� ����������� ��� ��������](http://www.campaignmonitor.com/blog/post/3363/updated-applying-a-background-image-to-html-email/)

[��������� ������ ������� �����������](http://backgrounds.cm/)

[��� ���](http://msdn.microsoft.com/en-us/library/bb264048%28v=vs.85%29.aspx)

[�������, ������, �� ������������ �������](http://msdn.microsoft.com/en-us/library/aa338201.aspx#Word2007MailHTMLandCSS_Core)

```html
...
<td background="http://www.example.ru/mail/bg.jpg" width="790" style="text-align: left;" valign="top">
	<!--[if gte mso 9]>
		<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:790px;height:572px;">
			<v:fill type="tile" src="http://www.example.ru/mail/bg.jpg" />
			<v:textbox style="mso-fit-shape-to-text:true" inset="245px,0,25px,60px">
	<![endif]-->
	<div style="padding-left: 245px;">
		<p style="display: block; font-family: 'arial'; font-size: 24px; line-height: 30px; font-weight: bold; margin: 95px 0 16px; color: #c5252a; padding: 0;">
			��������� ������,<br />�������, ����ͨ��!
		</p>
		<p style="display: block; font-family: 'arial'; font-size: 14px; line-height: 21px; margin: 0; padding: 0;">
			����������� � ������������ �������� �����������!
		</p>
	</div>
	<!--[if gte mso 9]>
			</v:textbox>
		</v:rect>
	<![endif]-->
</td>
...
```
